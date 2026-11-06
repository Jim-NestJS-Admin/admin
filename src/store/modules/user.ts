import { defineStore } from "pinia";
import { store } from "@/store";
import { getAdminGateway, gatewayReady } from "@/platform/gateway";
import { resetSessionViews } from "@/platform/lifecycle";
import {
  coordinatedRefresh,
  coordinatedMutation,
  invalidateOtherSessions,
  onRemoteSessionReset
} from "@/platform/session-browser";
import type {
  SessionSnapshot,
  SignInInput,
  NavigationItem
} from "@/platform/contracts";

let refreshPromise: Promise<void> | undefined;
export const useUserStore = defineStore("admin-user", {
  state: () => ({
    avatar: "",
    username: "",
    nickname: "",
    roles: [] as string[],
    permissions: [] as string[],
    accessToken: "",
    expiresAt: 0,
    organizationId: "",
    authVersion: undefined as number | undefined,
    menus: [] as NavigationItem[],
    epoch: 0,
    transitioning: false,
    isRemembered: false,
    loginDay: 0
  }),
  getters: {
    isAuthenticated: state =>
      !!state.accessToken && state.expiresAt > Date.now()
  },
  actions: {
    applySession(session: SessionSnapshot) {
      if (
        !session?.accessToken ||
        !Number.isFinite(session.expiresAt) ||
        session.expiresAt <= Date.now() ||
        !session.user?.id ||
        typeof session.organizationId !== "string" ||
        typeof session.user.username !== "string" ||
        !Array.isArray(session.permissions) ||
        !Array.isArray(session.menus)
      )
        throw new Error("admin.serviceUnavailable");
      const changed =
        this.accessToken &&
        (this.organizationId !== session.organizationId ||
          this.authVersion !== session.authVersion ||
          JSON.stringify(this.permissions) !==
            JSON.stringify(session.permissions) ||
          JSON.stringify(this.menus) !== JSON.stringify(session.menus));
      this.accessToken = session.accessToken;
      this.expiresAt = session.expiresAt;
      this.username = session.user.username;
      this.nickname = session.user.nickname ?? "";
      this.organizationId = session.organizationId;
      this.authVersion = session.authVersion;
      this.permissions = session.permissions.filter(
        value => typeof value === "string" && value !== "*:*:*"
      );
      this.menus = session.menus;
      if (changed && !this.transitioning) {
        this.epoch++;
        resetSessionViews();
      }
    },
    clearSession(notify = true) {
      this.epoch++;
      this.accessToken = "";
      this.expiresAt = 0;
      this.username = "";
      this.nickname = "";
      this.roles = [];
      this.permissions = [];
      this.menus = [];
      this.organizationId = "";
      this.authVersion = undefined;
      this.transitioning = false;
      resetSessionViews();
      if (notify) {
        try {
          invalidateOtherSessions();
        } catch {
          /* 不支持协调能力时，本地清理仍须完成。 */
        }
      }
    },
    async loginByUsername(input: SignInInput) {
      this.clearSession();
      const epoch = this.epoch;
      const session = await coordinatedMutation(() =>
        getAdminGateway().signIn(input)
      );
      if (epoch !== this.epoch) throw new Error("admin.requestCanceled");
      this.applySession(session);
    },
    async restoreSession() {
      if (!gatewayReady()) return;
      const epoch = this.epoch;
      try {
        const session = await coordinatedRefresh(() =>
          getAdminGateway().resume()
        );
        if (session && epoch === this.epoch) this.applySession(session);
      } catch {
        if (epoch === this.epoch) this.clearSession();
      }
    },
    async ensureFreshSession(force = false) {
      if (!this.accessToken) return;
      if (!force && this.expiresAt - Date.now() > 30000) return;
      if (!refreshPromise) {
        const epoch = this.epoch;
        refreshPromise = coordinatedRefresh(() => getAdminGateway().refresh())
          .then(session => {
            if (epoch !== this.epoch) throw new Error("admin.requestCanceled");
            this.applySession(session);
          })
          .catch(error => {
            if (epoch === this.epoch) this.clearSession();
            throw error;
          })
          .finally(() => {
            refreshPromise = undefined;
          });
      }
      await refreshPromise;
    },
    async switchOrganization(id: string) {
      if (!this.isAuthenticated || this.transitioning)
        throw new Error("admin.requestCanceled");
      this.epoch++;
      const epoch = this.epoch;
      this.transitioning = true;
      this.permissions = [];
      this.menus = [];
      resetSessionViews();
      try {
        const session = await coordinatedMutation(() =>
          getAdminGateway().switchOrganization(id)
        );
        if (epoch !== this.epoch) throw new Error("admin.requestCanceled");
        this.applySession(session);
      } catch (error) {
        if (epoch === this.epoch) this.clearSession();
        throw error;
      } finally {
        if (epoch === this.epoch) this.transitioning = false;
      }
    },
    async logOut() {
      const gateway = gatewayReady() ? getAdminGateway() : null;
      const pending = Promise.resolve().then(() =>
        coordinatedMutation(async () => {
          await gateway?.signOut();
        })
      );
      this.clearSession();
      try {
        await pending;
      } catch {
        /* 本地会话已经立即清理，远程失败不得恢复权限。 */
      }
    }
  }
});
export const useUserStoreHook = () => useUserStore(store);
onRemoteSessionReset(() => useUserStoreHook().clearSession(false));
