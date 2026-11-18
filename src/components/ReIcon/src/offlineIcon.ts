// 这里存放本地图标，在 src/layout/index.vue 文件中加载，避免在首启动加载
import { getSvgInfo } from "@pureadmin/utils";
import { addCollection, addIcon } from "@iconify/vue/dist/offline";
import elementPlusIcons from "@iconify/json/json/ep.json";
import LanguageIcon from "@/assets/svg/globalization.svg?raw";

// https://icon-sets.iconify.design/ri/?keyword=ri
import RiSearchLine from "~icons/ri/search-line?raw";
import RiInformationLine from "~icons/ri/information-line?raw";
import RiRobotLine from "~icons/ri/robot-line?raw";
import RiShieldKeyholeLine from "~icons/ri/shield-keyhole-line?raw";
import RiFolderLine from "~icons/ri/folder-line?raw";
import RiFlowChart from "~icons/ri/flow-chart?raw";
import RiFileList3Line from "~icons/ri/file-list-3-line?raw";
import RiCheckboxCircleLine from "~icons/ri/checkbox-circle-line?raw";
import RiUser3Line from "~icons/ri/user-3-line?raw";
import RiOrganizationChart from "~icons/ri/organization-chart?raw";
import RiFileSearchLine from "~icons/ri/file-search-line?raw";
import RiBarChartLine from "~icons/ri/bar-chart-line?raw";
import RiSettings3Line from "~icons/ri/settings-3-line?raw";
import RiNotification3Line from "~icons/ri/notification-3-line?raw";
import RiDatabase2Line from "~icons/ri/database-2-line?raw";
import RiAppsLine from "~icons/ri/apps-line?raw";
import RiCodeBoxLine from "~icons/ri/code-box-line?raw";
import RiCalendarLine from "~icons/ri/calendar-line?raw";
import RiSparklingLine from "~icons/ri/sparkling-line?raw";
import RiGlobalLine from "~icons/ri/global-line?raw";
import RiTeamLine from "~icons/ri/team-line?raw";

export type MenuIconSource = "local" | "project" | "online";

export interface MenuIconOption {
  value: string;
  label?: string;
  source: MenuIconSource;
}

const localIcons = [
  ["ri/folder-line", "folder", RiFolderLine],
  ["ri/flow-chart", "workflow", RiFlowChart],
  ["ri/file-list-3-line", "form", RiFileList3Line],
  ["ri/checkbox-circle-line", "approval", RiCheckboxCircleLine],
  ["ri/shield-keyhole-line", "permissions", RiShieldKeyholeLine],
  ["ri/user-3-line", "user", RiUser3Line],
  ["ri/organization-chart", "organization", RiOrganizationChart],
  ["ri/file-search-line", "audit", RiFileSearchLine],
  ["ri/bar-chart-line", "report", RiBarChartLine],
  ["ri/settings-3-line", "settings", RiSettings3Line],
  ["ri/notification-3-line", "notification", RiNotification3Line],
  ["ri/robot-line", "assistant", RiRobotLine],
  ["ri/sparkling-line", "sparkling", RiSparklingLine],
  ["ri/global-line", "site", RiGlobalLine],
  ["ri/team-line", "team", RiTeamLine],
  ["ri/database-2-line", "database", RiDatabase2Line],
  ["ri/apps-line", "modules", RiAppsLine],
  ["ri/code-box-line", "development", RiCodeBoxLine],
  ["ri/calendar-line", "schedule", RiCalendarLine],
  ["ri/search-line", "search", RiSearchLine],
  ["ri/information-line", "information", RiInformationLine]
] as const;

const elementPlusLabels: Record<string, string> = {
  bell: "notification",
  calendar: "schedule",
  "circle-check": "approval",
  collection: "modules",
  document: "form",
  folder: "folder",
  "folder-opened": "folder",
  "home-filled": "home",
  "info-filled": "information",
  lock: "permissions",
  "office-building": "organization",
  "pie-chart": "report",
  search: "search",
  setting: "settings",
  suitcase: "business",
  tickets: "form",
  user: "user",
  "user-filled": "user"
};

// 显式用斜杠前缀，让 Pure Admin 将 ep/... 标识交给离线渲染器。
addCollection(elementPlusIcons, "ep/");

/** 菜单和选择器由同一份清单注册，持久化的标识可由 useRenderIcon 直接解析。 */
function registerSvgs(
  source: "local" | "project",
  icons: ReadonlyArray<readonly [string, string, unknown]>
): MenuIconOption[] {
  return icons.map(([value, label, svg]) => {
    // unplugin-icons 的 Vue 类型也会覆盖 ?raw 导入，实际返回 SVG 字符串。
    addIcon(value, getSvgInfo(svg as string));
    return { value, label, source };
  });
}

export const menuIconOptions: MenuIconOption[] = [
  ...Object.keys(elementPlusIcons.icons).map(
    (name): MenuIconOption => ({
      value: `ep/${name}`,
      label: elementPlusLabels[name],
      source: "local"
    })
  ),
  ...registerSvgs("local", localIcons),
  ...registerSvgs("project", [["project/language", "language", LanguageIcon]]),
  { value: "IF-pure-iconfont-logo", label: "brand", source: "project" },
  { value: "IF-pure-iconfont-tabs", label: "tabs", source: "project" },
  { value: "IF-pure-iconfont-new", label: "newItem", source: "project" },
  { value: "lucide:calendar-clock", label: "schedule", source: "online" },
  { value: "lucide:briefcase-business", label: "business", source: "online" },
  { value: "lucide:boxes", label: "modules", source: "online" },
  { value: "lucide:globe", label: "site", source: "online" }
];

const menuIconByValue = new Map(
  menuIconOptions.map(option => [option.value, option])
);

/** 已绑定的 ri:xxx 有相同离线图标时直接用本地资源预览，表单值仍是原值。 */
export function findMenuIcon(value?: string | null) {
  if (!value) return;
  return (
    menuIconByValue.get(value) ?? menuIconByValue.get(value.replace(":", "/"))
  );
}
