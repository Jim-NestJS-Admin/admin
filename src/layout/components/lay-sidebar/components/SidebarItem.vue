<script setup lang="ts">
import { getConfig } from "@/config";
import { posix } from "path-browserify";
import { menuType } from "@/layout/types";
import { ReText } from "@/components/ReText";
import { useNav } from "@/layout/hooks/useNav";
import { transformI18n } from "@/plugins/i18n";
import { useRouter } from "vue-router";
import SidebarLinkItem from "./SidebarLinkItem.vue";
import SidebarExtraIcon from "./SidebarExtraIcon.vue";
import SidebarCountBadge from "./SidebarCountBadge.vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import {
  type PropType,
  type CSSProperties,
  ref,
  toRaw,
  computed,
  useAttrs
} from "vue";

import ArrowUp from "~icons/ep/arrow-up-bold";
import EpArrowDown from "~icons/ep/arrow-down-bold";
import ArrowLeft from "~icons/ep/arrow-left-bold";
import ArrowRight from "~icons/ep/arrow-right-bold";

const attrs = useAttrs();
const router = useRouter();
const { layout, isCollapse, tooltipEffect } = useNav();

const props = defineProps({
  item: {
    type: Object as PropType<menuType>
  },
  isNest: {
    type: Boolean,
    default: false
  },
  basePath: {
    type: String,
    default: ""
  },
  pendingByPath: Object as PropType<Record<string, number>>,
  openGroup: Function as PropType<(path: string) => void>
});

const getNoDropdownStyle = computed((): CSSProperties => {
  return {
    width: "100%",
    display: "flex",
    alignItems: "center"
  };
});

const getSubMenuIconStyle = computed((): CSSProperties => {
  return {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin:
      layout.value === "horizontal"
        ? "0 5px 0 0"
        : isCollapse.value
          ? "0 auto"
          : "0 5px 0 0"
  };
});

const textClass = computed(() => {
  const item = props.item;
  const baseClass = "w-full! text-inherit!";
  if (
    layout.value !== "horizontal" &&
    isCollapse.value &&
    !toRaw(item.meta.icon) &&
    ((layout.value === "vertical" && item.parentId === null) ||
      (layout.value === "mix" && item.pathList.length === 2))
  ) {
    return `${baseClass} min-w-[54px]! text-center! px-3!`;
  }
  return baseClass;
});

const expandCloseIcon = computed(() => {
  if (!getConfig()?.MenuArrowIconNoTransition) return "";
  return {
    "expand-close-icon": useRenderIcon(EpArrowDown),
    "expand-open-icon": useRenderIcon(ArrowUp),
    "collapse-close-icon": useRenderIcon(ArrowRight),
    "collapse-open-icon": useRenderIcon(ArrowLeft)
  };
});

const onlyOneChild: menuType = ref(null);

function hasOneShowingChild(children: menuType[] = [], parent: menuType) {
  const showingChildren = children.filter((item: any) => {
    onlyOneChild.value = item;
    return true;
  });

  if (showingChildren[0]?.meta?.showParent) {
    return false;
  }

  if (showingChildren.length === 1) {
    return true;
  }

  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, path: "", noShowingChildren: true };
    return true;
  }
  return false;
}

function resolvePath(routePath) {
  const httpReg = /^http(s?):\/\//;
  if (httpReg.test(routePath) || httpReg.test(props.basePath)) {
    return routePath || props.basePath;
  } else {
    return posix.resolve(props.basePath, routePath);
  }
}

type PendingEntry = { path: string; count: number; groups: string[] };

function collectPending(
  menu: menuType,
  path: string,
  groups: string[],
  entries: Map<string, PendingEntry>
) {
  if (menu.children?.length) {
    const [child] = menu.children;
    const ancestors =
      menu.children.length === 1 && !child.meta?.showParent && !child.children
        ? groups
        : [...groups, path];
    for (const child of menu.children)
      collectPending(
        child,
        posix.resolve(path, child.path ?? ""),
        ancestors,
        entries
      );
    return;
  }
  const count = props.pendingByPath?.[path] ?? 0;
  if (count > 0 && !entries.has(path))
    entries.set(path, { path, count, groups });
}

const pendingEntries = computed(() => {
  const entries = new Map<string, PendingEntry>();
  collectPending(
    props.item,
    props.basePath || props.item.path || "",
    [],
    entries
  );
  return [...entries.values()];
});
const pendingCount = computed(() =>
  pendingEntries.value.reduce((sum, entry) => sum + entry.count, 0)
);
function pendingLocation(path: string) {
  return path === "/workflow/instance"
    ? { path, query: { pending: "1" } }
    : { path };
}

function activatePending() {
  const [first, ...other] = pendingEntries.value;
  if (!first) return;
  if (!other.length) {
    const group = first.groups.at(-1);
    if (group) props.openGroup?.(group);
    void router.push(pendingLocation(first.path));
    return;
  }
  // 先打开待办入口共享的最深分组，分叉后让各分组继续显示自己的汇总。
  const common = [...first.groups]
    .reverse()
    .find(path => other.every(entry => entry.groups.includes(path)));
  if (common) props.openGroup?.(common);
}
const compactBadge = computed(
  () => isCollapse.value && !props.isNest && layout.value !== "horizontal"
);
</script>

<template>
  <SidebarLinkItem
    v-if="
      hasOneShowingChild(item.children, item) &&
      (!onlyOneChild.children || onlyOneChild.noShowingChildren)
    "
    :to="item"
  >
    <el-menu-item
      :index="resolvePath(onlyOneChild.path)"
      :class="{ 'submenu-title-noDropdown': !isNest }"
      :style="getNoDropdownStyle"
      v-bind="attrs"
    >
      <div
        v-if="toRaw(item.meta.icon)"
        class="sub-menu-icon"
        :style="getSubMenuIconStyle"
      >
        <component
          :is="
            useRenderIcon(
              toRaw(onlyOneChild.meta.icon) ||
                (item.meta && toRaw(item.meta.icon))
            )
          "
        />
      </div>
      <el-text
        v-if="
          (!item?.meta.icon &&
            isCollapse &&
            layout === 'vertical' &&
            item?.pathList?.length === 1) ||
          (!onlyOneChild.meta.icon &&
            isCollapse &&
            layout === 'mix' &&
            item?.pathList?.length === 2)
        "
        truncated
        class="w-full! px-3! min-w-[54px]! text-center! text-inherit!"
      >
        {{ transformI18n(onlyOneChild.meta.title) }}
      </el-text>

      <SidebarCountBadge
        v-if="compactBadge"
        :count="pendingCount"
        class="sidebar-count-compact"
        @activate="activatePending"
      />

      <template #title>
        <div class="sidebar-title-row">
          <ReText
            :tippyProps="{
              offset: [0, -10],
              theme: tooltipEffect
            }"
            class="sidebar-menu-label text-inherit!"
          >
            {{ transformI18n(onlyOneChild.meta.title) }}
          </ReText>
          <SidebarExtraIcon :extraIcon="onlyOneChild.meta.extraIcon" />
          <SidebarCountBadge
            v-if="!compactBadge"
            :count="pendingCount"
            @activate="activatePending"
          />
        </div>
      </template>
    </el-menu-item>
  </SidebarLinkItem>
  <el-sub-menu
    v-else
    ref="subMenu"
    teleported
    :index="resolvePath(item.path)"
    v-bind="expandCloseIcon"
  >
    <template #title>
      <div
        v-if="toRaw(item.meta.icon)"
        :style="getSubMenuIconStyle"
        class="sub-menu-icon"
      >
        <component :is="useRenderIcon(item.meta && toRaw(item.meta.icon))" />
      </div>
      <div
        class="sidebar-title-row"
        :class="{
          'sidebar-title-row-with-arrow': pendingCount > 0 && !compactBadge
        }"
      >
        <ReText
          v-if="
            layout === 'mix' && toRaw(item.meta.icon)
              ? !isCollapse || item?.pathList?.length !== 2
              : !(
                  layout === 'vertical' &&
                  isCollapse &&
                  toRaw(item.meta.icon) &&
                  item.parentId === null
                )
          "
          :tippyProps="{
            offset: [0, -10],
            theme: tooltipEffect
          }"
          class="sidebar-menu-label"
          :class="textClass"
        >
          {{ transformI18n(item.meta.title) }}
        </ReText>
        <SidebarExtraIcon v-if="!isCollapse" :extraIcon="item.meta.extraIcon" />
        <SidebarCountBadge
          v-if="!compactBadge"
          :count="pendingCount"
          group
          class="sidebar-count-group"
          @activate="activatePending"
        />
      </div>
      <SidebarCountBadge
        v-if="compactBadge"
        :count="pendingCount"
        group
        class="sidebar-count-compact sidebar-count-group"
        @activate="activatePending"
      />
    </template>

    <sidebar-item
      v-for="child in item.children"
      :key="child.path"
      :is-nest="true"
      :item="child"
      :base-path="resolvePath(child.path)"
      :pending-by-path="pendingByPath"
      :open-group="openGroup"
      class="nest-menu"
    />
  </el-sub-menu>
</template>

<style scoped>
.sidebar-title-row {
  display: flex;
  flex: 1;
  align-items: center;
  min-width: 0;
}

.sidebar-menu-label {
  flex: 1;
  min-width: 0;
}

.sidebar-title-row-with-arrow {
  margin-inline-end: 16px;
}

.sidebar-count-compact {
  position: absolute;
  inset-block: 4px auto;
  inset-inline-end: 4px;
  height: auto;
  margin: 0;
}

:global(.el-sub-menu.is-opened > .el-sub-menu__title) > .sidebar-count-group,
:global(.el-sub-menu.is-opened > .el-sub-menu__title)
  > .sidebar-title-row
  > .sidebar-count-group {
  display: none;
}
</style>
