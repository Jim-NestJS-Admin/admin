<script setup lang="ts">
/**
 * 第 6 步代码预览：左边文件树（建表 SQL + 后端 / 前端文件，标出新建 / 覆盖 / 未变 / 手改跳过），
 * 右边看代码（高亮、行号、复制）；已存在且内容不同的文件可切到「差异」。
 */
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import CopyIcon from "~icons/ri/file-copy-line";
import FolderIcon from "~icons/ri/folder-3-line";
import FileIcon from "~icons/ri/file-code-line";
import DatabaseIcon from "~icons/ri/database-2-line";
import {
  formatSql,
  diffStats,
  languageOf,
  lineDiff,
  tokenLines,
  type DiffLine
} from "./code";
import type { components } from "@/api/schema";

type Preview = components["schemas"]["SpecPreviewResult"];
type SpecFile = components["schemas"]["SpecFile"];
const props = defineProps<{ preview: Preview }>();
/** 勾选要覆盖的手改文件（file.key），其余手改文件写入时跳过 */
const overwrite = defineModel<string[]>("overwrite", { default: () => [] });
const chosen = (file: SpecFile) =>
  file.action === "skip-modified" && overwrite.value.includes(file.key);
function toggle(file: SpecFile, value: boolean) {
  overwrite.value = value
    ? [...overwrite.value.filter(key => key !== file.key), file.key]
    : overwrite.value.filter(key => key !== file.key);
}
const { t } = useI18n();

const SQL_KEY = "$sql";
type Node = {
  key: string;
  label: string;
  folder?: boolean;
  file?: SpecFile;
  children?: Node[];
};
const fileKey = (file: SpecFile) => `${file.project}/${file.path}`;
/** 按目录建树；只有一个子目录的目录合并显示（src/modules/crm 这样），树更短 */
const tree = computed<Node[]>(() => {
  const roots: Node[] = [{ key: SQL_KEY, label: t("codegen.sqlFile") }];
  for (const project of ["server", "admin"] as const) {
    const files = props.preview.files.filter(file => file.project === project);
    if (!files.length) continue;
    const root: Node = {
      key: project,
      label: t(`codegen.projects.${project}`),
      folder: true,
      children: []
    };
    for (const file of files) {
      const parts = file.path.split("/");
      let parent = root;
      parts.slice(0, -1).forEach((part, index) => {
        const key = `${project}/${parts.slice(0, index + 1).join("/")}`;
        let next = parent.children!.find(node => node.key === key);
        if (!next) {
          next = { key, label: part, folder: true, children: [] };
          parent.children!.push(next);
        }
        parent = next;
      });
      parent.children!.push({
        key: fileKey(file),
        label: parts[parts.length - 1],
        file
      });
    }
    const squash = (node: Node): Node => {
      if (!node.children) return node;
      let current = node;
      while (
        current !== root &&
        current.children?.length === 1 &&
        current.children[0].folder
      ) {
        const child: Node = current.children[0];
        current = { ...child, label: `${current.label}/${child.label}` };
      }
      return { ...current, children: current.children?.map(squash) };
    };
    roots.push(squash(root));
  }
  return roots;
});
const selected = ref(SQL_KEY);
const mode = ref<"code" | "diff">("code");
watch(
  () => props.preview,
  () => {
    if (
      selected.value !== SQL_KEY &&
      !props.preview.files.some(file => fileKey(file) === selected.value)
    )
      selected.value = SQL_KEY;
  }
);
const current = computed(() =>
  props.preview.files.find(file => fileKey(file) === selected.value)
);
const content = computed(() =>
  selected.value === SQL_KEY
    ? props.preview.sql
        .map(statement =>
          /^(CREATE|ALTER) TABLE/i.test(statement)
            ? formatSql(statement)
            : statement
        )
        .join("\n\n")
    : (current.value?.content ?? "")
);
const path = computed(() =>
  selected.value === SQL_KEY ? "migration.sql" : (current.value?.path ?? "")
);
const canDiff = computed(
  () =>
    !!current.value &&
    !!current.value.previous &&
    current.value.previous !== current.value.content
);
watch(selected, () => {
  mode.value = canDiff.value ? "diff" : "code";
});
const lines = computed(() => tokenLines(content.value, languageOf(path.value)));
const diff = computed<DiffLine[]>(() =>
  canDiff.value && mode.value === "diff"
    ? lineDiff(current.value!.previous, current.value!.content)
    : []
);
const stats = computed(() => diffStats(diff.value));

const counts = computed(() => {
  const result = { create: 0, overwrite: 0, unchanged: 0, "skip-modified": 0 };
  for (const file of props.preview.files) result[file.action]++;
  return result;
});
const actionType = (action: SpecFile["action"]) =>
  ({
    create: "success",
    overwrite: "warning",
    unchanged: "info",
    "skip-modified": "danger"
  })[action] as "success" | "warning" | "info" | "danger";

async function copy() {
  try {
    await navigator.clipboard.writeText(content.value);
    ElMessage.success(t("codegen.copied"));
  } catch {
    ElMessage.error(t("codegen.copyFailed"));
  }
}
</script>

<template>
  <div class="code-preview">
    <div class="code-summary">
      <span
        v-for="(count, action) in counts"
        :key="action"
        class="summary-item"
      >
        <el-tag :type="actionType(action)" effect="light" size="small">{{
          t(`codegen.actions.${action}`)
        }}</el-tag>
        <b>{{ count }}</b>
      </span>
      <span class="summary-note">{{ t("codegen.previewNote") }}</span>
    </div>
    <div class="code-body">
      <aside class="code-tree">
        <el-scrollbar>
          <el-tree
            :data="tree"
            node-key="key"
            :current-node-key="selected"
            default-expand-all
            highlight-current
            :expand-on-click-node="true"
            :props="{ label: 'label', children: 'children' }"
            @node-click="(node: Node) => !node.folder && (selected = node.key)"
          >
            <template #default="{ data: node }">
              <span class="tree-node" :class="{ 'is-file': !node.folder }">
                <component
                  :is="
                    node.key === SQL_KEY
                      ? DatabaseIcon
                      : node.folder
                        ? FolderIcon
                        : FileIcon
                  "
                  class="tree-icon"
                />
                <span class="tree-label">{{ node.label }}</span>
                <el-tag
                  v-if="node.file"
                  :type="
                    chosen(node.file) ? 'warning' : actionType(node.file.action)
                  "
                  size="small"
                  effect="plain"
                  class="tree-tag"
                  >{{
                    t(
                      `codegen.actions.${chosen(node.file) ? "overwrite" : node.file.action}`
                    )
                  }}</el-tag
                >
              </span>
            </template>
          </el-tree>
        </el-scrollbar>
      </aside>
      <section class="code-view">
        <header class="view-head">
          <span class="view-path">{{
            current
              ? `${current.project}/${current.path}`
              : t("codegen.sqlFile")
          }}</span>
          <el-tag
            v-if="current"
            :type="actionType(current.action)"
            size="small"
            effect="light"
            >{{ t(`codegen.actions.${current.action}`) }}</el-tag
          >
          <span v-if="mode === 'diff'" class="diff-stats">
            <span class="is-add">+{{ stats.added }}</span>
            <span class="is-remove">−{{ stats.removed }}</span>
          </span>
          <div class="view-flex" />
          <el-checkbox
            v-if="current?.action === 'skip-modified'"
            :model-value="chosen(current)"
            size="small"
            @change="toggle(current, !!$event)"
            >{{ t("codegen.overwriteThis") }}</el-checkbox
          >
          <el-segmented
            v-if="canDiff"
            v-model="mode"
            size="small"
            :options="[
              { value: 'diff', label: t('codegen.viewDiff') },
              { value: 'code', label: t('codegen.viewCode') }
            ]"
          />
          <el-button
            link
            type="primary"
            :icon="useRenderIcon(CopyIcon)"
            @click="copy"
            >{{ t("codegen.copy") }}</el-button
          >
        </header>
        <el-alert
          v-if="current?.action === 'skip-modified'"
          :title="
            t(
              chosen(current)
                ? 'codegen.overwriteChosenTip'
                : 'codegen.skipModifiedTip'
            )
          "
          type="warning"
          :closable="false"
          show-icon
          class="view-alert"
        />
        <el-alert
          v-else-if="selected === SQL_KEY"
          :title="t('codegen.sqlTip')"
          type="info"
          :closable="false"
          show-icon
          class="view-alert"
        />
        <el-scrollbar class="view-body">
          <div v-if="mode === 'diff' && canDiff" class="code-lines">
            <div
              v-for="(line, index) in diff"
              :key="index"
              class="code-line"
              :class="`is-${line.kind}`"
            >
              <span class="line-no">{{ line.left ?? "" }}</span>
              <span class="line-no">{{ line.right ?? "" }}</span>
              <span class="line-sign">{{
                line.kind === "add" ? "+" : line.kind === "remove" ? "−" : ""
              }}</span>
              <span class="line-text">{{
                line.kind === "skip"
                  ? t("codegen.skippedLines", { count: line.text })
                  : line.text
              }}</span>
            </div>
          </div>
          <div v-else class="code-lines">
            <div
              v-for="(tokens, index) in lines"
              :key="index"
              class="code-line"
            >
              <span class="line-no">{{ index + 1 }}</span>
              <span class="line-text"
                ><span
                  v-for="(token, part) in tokens"
                  :key="part"
                  :class="`tk-${token.kind}`"
                  >{{ token.text }}</span
                ></span
              >
            </div>
          </div>
        </el-scrollbar>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
@media (width <= 900px) {
  .code-body {
    flex-direction: column;
  }

  .code-tree {
    width: 100%;
    max-height: 220px;
  }
}

.code-preview {
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
  min-height: 0;
}

.code-summary {
  display: flex;
  flex-shrink: 0;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}

.summary-item {
  display: inline-flex;
  gap: 6px;
  align-items: center;
}

.summary-note {
  font-size: var(--el-font-size-small);
  color: var(--el-text-color-secondary);
}

.code-body {
  display: flex;
  flex: 1;
  gap: 12px;
  min-height: 0;
}

.code-tree {
  flex-shrink: 0;
  width: 300px;
  min-height: 0;
  padding: 6px 0;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 4px;
}

.tree-node {
  display: flex;
  flex: 1;
  gap: 6px;
  align-items: center;
  min-width: 0;
  padding-right: 8px;
  font-size: var(--el-font-size-small);
}

.tree-icon {
  flex-shrink: 0;
  font-size: 15px;
  color: var(--el-text-color-secondary);
}

.tree-label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tree-tag {
  flex-shrink: 0;
}

.code-view {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 4px;
}

.view-head {
  display: flex;
  flex-shrink: 0;
  gap: 8px;
  align-items: center;
  height: 40px;
  padding: 0 12px;
  background: var(--el-fill-color-light);
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.view-path {
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: var(--el-font-family-mono, monospace);
  font-size: var(--el-font-size-small);
  white-space: nowrap;
}

.view-flex {
  flex: 1;
}

.diff-stats {
  display: inline-flex;
  gap: 6px;
  font-family: monospace;
  font-size: var(--el-font-size-small);
}

.is-add {
  color: var(--el-color-success);
}

.is-remove {
  color: var(--el-color-danger);
}

.view-alert {
  flex-shrink: 0;
  border-radius: 0;
}

.view-body {
  flex: 1;
  min-height: 0;
}

/* 代码区：等宽、行号、不折行，横向滚动 */
.code-lines {
  min-width: max-content;
  padding: 8px 0;
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 12.5px;
  line-height: 20px;
}

.code-line {
  display: flex;
  white-space: pre;
}

.line-no {
  flex-shrink: 0;
  width: 44px;
  padding-right: 10px;
  color: var(--el-text-color-placeholder);
  text-align: right;
  user-select: none;
}

.line-sign {
  flex-shrink: 0;
  width: 16px;
  text-align: center;
  user-select: none;
}

.line-text {
  padding-right: 24px;
}

.code-line.is-add {
  background: var(--el-color-success-light-9);
}

.code-line.is-add .line-sign {
  color: var(--el-color-success);
}

.code-line.is-remove {
  background: var(--el-color-danger-light-9);
}

.code-line.is-remove .line-sign {
  color: var(--el-color-danger);
}

.code-line.is-skip {
  color: var(--el-text-color-secondary);
  background: var(--el-fill-color-lighter);
}

.tk-comment {
  font-style: italic;
  color: #6a737d;
}

.tk-string {
  color: #22863a;
}

.tk-keyword {
  color: #d73a49;
}

.tk-number {
  color: #005cc5;
}

.tk-tag {
  color: #6f42c1;
}

html.dark .tk-comment {
  color: #8b949e;
}

html.dark .tk-string {
  color: #7ee787;
}

html.dark .tk-keyword {
  color: #ff7b72;
}

html.dark .tk-number {
  color: #79c0ff;
}

html.dark .tk-tag {
  color: #d2a8ff;
}
</style>
