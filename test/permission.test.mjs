import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "vite";
import { nextTick } from "vue";
import { fileURLToPath } from "node:url";
test("v-perm 跟随授权变化立即撤销，并保留已有无障碍属性", async () => {
  const server = await createServer({
    configFile: false,
    optimizeDeps: { noDiscovery: true, include: [] },
    server: { middlewareMode: true, ws: false },
    resolve: {
      alias: { "@": fileURLToPath(new URL("../src", import.meta.url)) }
    }
  });
  try {
    const { perm } = await server.ssrLoadModule(
      "/src/directives/perm/index.ts"
    );
    const { useUserStoreHook } = await server.ssrLoadModule(
      "/src/store/modules/user.ts"
    );
    const user = useUserStoreHook();
    user.applySession({
      accessToken: "synthetic",
      expiresAt: Date.now() + 60000,
      user: { id: "one", username: "one" },
      organizationId: "one",
      permissions: ["read"],
      menus: []
    });
    const attributes = new Map([["aria-hidden", "false"]]);
    const styles = new Map();
    const element = {
      hidden: false,
      inert: false,
      getAttribute: key => attributes.get(key) ?? null,
      setAttribute: (key, value) => attributes.set(key, value),
      removeAttribute: key => attributes.delete(key),
      style: {
        getPropertyValue: key => styles.get(key) ?? "",
        getPropertyPriority: () => "",
        setProperty: (key, value) => styles.set(key, value),
        removeProperty: key => styles.delete(key)
      }
    };
    perm.beforeMount(element, { value: "read" });
    assert.equal(element.hidden, false);
    user.permissions = [];
    await nextTick();
    assert.equal(element.hidden, true);
    assert.equal(element.inert, true);
    user.permissions = ["read"];
    await nextTick();
    assert.equal(element.hidden, false);
    assert.equal(attributes.get("aria-hidden"), "false");
    perm.updated(element, { value: "write" });
    await nextTick();
    assert.equal(element.hidden, true);
    perm.unmounted(element);
    user.permissions = ["write"];
    await nextTick();
    assert.equal(element.hidden, true);
  } finally {
    await server.close();
  }
});
