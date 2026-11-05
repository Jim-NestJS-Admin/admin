<script setup lang="ts">
import { ref } from "vue";
import { CrudPage } from "@/components/Crud";
import type {
  CrudPort,
  CrudSchema,
  CrudCell,
  CrudRecord
} from "@/components/Crud";
import { defaultCell } from "@/components/Crud/model.mjs";
import { useUserStoreHook } from "@/store/modules/user";
import { resetSessionViews } from "@/platform/lifecycle";
import { RequestFailure } from "@/utils/http";
import description from "./fixtures/t03-user-schema.json";
const user = useUserStoreHook();
user.applySession({
  accessToken: "synthetic-browser-only",
  expiresAt: Date.now() + 3600000,
  user: { id: "test", username: "合成测试" },
  organizationId: "test",
  permissions: ["test-create", "test-update", "test-remove"],
  menus: []
});
const page = ref(),
  event = ref("等待操作"),
  conflict = ref(false),
  limited = ref(false);
let savedPreferences,
  nextId = 100;
let records: CrudRecord[] = Array.from({ length: 32 }, (_, i) => ({
  id: String(i + 1),
  version: 1,
  username: `member_${String(i + 1).padStart(2, "0")}`,
  nickname: i === 1 ? "李*" : `测试人员 ${i + 1}`,
  status: i % 3 ? "enabled" : "disabled",
  remark: "仅用于组件验证"
}));
const schema = structuredClone(description) as CrudSchema;
schema.label = "成员列表";
schema.columns = schema.columns.filter(column =>
  ["username", "nickname", "status"].includes(column.field)
);
schema.defaultSort = [];
function cell(row: CrudRecord, field: string): CrudCell {
  return row.id === "2" && field === "nickname"
    ? { state: "masked", display: "李*" }
    : row.id === "3" && field === "nickname"
      ? { state: "hidden", display: undefined }
      : defaultCell(row, field);
}
function beforeWrite(options) {
  event.value = `提交键 ${options.idempotencyKey}`;
  if (limited.value)
    throw new RequestFailure({
      code: 4429,
      status: 429,
      message: "请求太频繁",
      data: { retryAfterSeconds: 3 }
    });
}
const port: CrudPort = {
  describe: async () => structuredClone(schema),
  list: async query => {
    event.value = `第 ${query.pageNumber} 页；排序 ${query.sorting.map(item => `${item.field} ${item.direction}`).join(",") || "默认"}`;
    let data = records.filter(
      row =>
        !query.search ||
        String(row.username).includes(query.search) ||
        String(row.nickname).includes(query.search)
    );
    if (query.equality.status)
      data = data.filter(row => row.status === query.equality.status);
    if (query.sorting.length) {
      const { field, direction } = query.sorting[0];
      data = [...data].sort(
        (a, b) =>
          String(a[field]).localeCompare(String(b[field])) *
          (direction === "asc" ? 1 : -1)
      );
    }
    return {
      rows: structuredClone(
        data.slice(
          (query.pageNumber - 1) * query.pageSize,
          query.pageNumber * query.pageSize
        )
      ),
      totalRows: data.length
    };
  },
  detail: async id => structuredClone(records.find(row => row.id === id)),
  create: async (values, options) => {
    beforeWrite(options);
    const row = { ...values, id: String(++nextId), version: 1 };
    records.unshift(row);
    return row;
  },
  update: async (current, values, options) => {
    beforeWrite(options);
    if (conflict.value)
      throw new RequestFailure({
        code: 4009,
        status: 409,
        message: "数据已被他人修改，请刷新",
        data: {
          errors: [{ field: "data.nickname", messages: ["请刷新后再编辑"] }]
        }
      });
    const row = records.find(row => row.id === current.id);
    Object.assign(row, values, { version: Number(row.version) + 1 });
    return row;
  },
  remove: async (ids, options) => {
    beforeWrite(options);
    records = records.filter(row => !ids.includes(String(row.id)));
  },
  preferences: {
    load: async () => savedPreferences,
    save: async (_page, values) => {
      savedPreferences = JSON.parse(JSON.stringify(values));
      event.value = "显示偏好已由测试适配口接收";
    }
  }
};
</script>
<template>
  <main class="test-shell">
    <header class="test-heading">
      <div>
        <h1>组件验收台</h1>
        <span>合成数据 · 独立测试入口</span>
      </div>
      <div>
        <el-checkbox v-model="conflict">模拟冲突</el-checkbox
        ><el-checkbox v-model="limited">模拟限流</el-checkbox
        ><el-button @click="resetSessionViews">清空会话视图</el-button
        ><el-button @click="page.reload()">重新加载</el-button>
      </div>
    </header>
    <output class="test-event">{{ event }}</output
    ><CrudPage
      ref="page"
      :port="port"
      page-key="test-users"
      :cell="cell"
      :permissions="{
        create: 'test-create',
        update: 'test-update',
        remove: 'test-remove'
      }"
      ><template #tree="{ filter }"
        ><h2>成员状态</h2>
        <el-button text @click="filter('status', undefined)">全部成员</el-button
        ><el-button text @click="filter('status', 'enabled')">正常</el-button
        ><el-button text @click="filter('status', 'disabled')"
          >停用</el-button
        ></template
      ></CrudPage
    >
  </main>
</template>
<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
  font-family: system-ui, sans-serif;
  color: #303133;
}
* {
  box-sizing: border-box;
}
.test-shell {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px;
  background: #f4f6f9;
  gap: 12px;
}
.test-heading {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}
.test-heading h1 {
  margin: 0 0 4px;
  font-size: 22px;
}
.test-heading span,
.test-event {
  font-size: 13px;
  color: #606266;
}
.test-heading > div:last-child {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}
.test-shell > .crud-page {
  flex: 1;
}
.test-shell h2 {
  font-size: 15px;
}
.crud-tree .el-button {
  display: block;
  margin: 6px 0;
}
@media (max-width: 760px) {
  .test-shell {
    padding: 8px;
  }
  .test-heading h1 {
    font-size: 18px;
  }
}
</style>
