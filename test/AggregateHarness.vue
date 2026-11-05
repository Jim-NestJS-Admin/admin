<script setup lang="ts">
import { ref } from "vue";
import { CrudPage } from "@/components/Crud";
import type { CrudPort, CrudSchema, CrudRecord } from "@/components/Crud";
import { useUserStoreHook } from "@/store/modules/user";
import { resetSessionViews } from "@/platform/lifecycle";
import { RequestFailure } from "@/utils/http";
import description from "./fixtures/t03-order-schema.json";
const perms = {
  create: "test-create",
  info: "test-info",
  update: "test-update",
  remove: "test-remove",
  recycle: "test-recycle",
  restore: "test-restore",
  purge: "test-purge"
};
useUserStoreHook().applySession({
  accessToken: "synthetic-browser-only",
  expiresAt: Date.now() + 3600000,
  user: { id: "test", username: "合成测试" },
  organizationId: "test",
  permissions: Object.values(perms),
  menus: []
});
const page = ref(),
  lineError = ref(false),
  conflict = ref(false),
  event = ref("等待操作");
const schema = structuredClone(description) as CrudSchema;
schema.label = "采购单";
schema.columns = schema.columns.filter(column =>
  ["orderNo", "title", "version"].includes(column.field)
);
schema.defaultSort = [];
schema.children.forEach(child => {
  child.columns = child.columns.filter(column =>
    child.form.some(item => item.field === column.field)
  );
});
let nextId = 100;
const records: CrudRecord[] = [
  {
    id: "1",
    version: 7,
    orderNo: "PO-2026-001",
    title: "样品采购",
    children: {
      items: [
        { id: "10", productCode: "SKU-A", qty: 2, sort: 0, remark: "蓝色" },
        { id: "11", productCode: "SKU-B", qty: 3, sort: 1, remark: "" }
      ],
      notes: [{ id: "12", content: "工作日送达" }],
      tags: []
    }
  },
  {
    id: "2",
    version: 3,
    orderNo: "PO-2026-002",
    title: "已删除的采购单",
    deletedAt: "2026-11-05T02:00:00Z",
    children: {
      items: [{ id: "20", productCode: "SKU-C", qty: 1, sort: 0 }],
      notes: [],
      tags: []
    }
  }
];
const bodyFor = (values, options) => ({
  data: values,
  children: Object.fromEntries(
    (options.relatedChanges ?? []).map(group => [
      group.resource,
      {
        added: group.inserted.map(row => ({
          ...row.values,
          clientId: row.localKey
        })),
        updated: group.modified.map(row => ({
          ...row.values,
          id: row.recordKey
        })),
        deleted: group.removed
      }
    ])
  )
});
function failure(status, message, data = null) {
  return new RequestFailure({
    status,
    code: status === 409 ? 4009 : 4000,
    message,
    data
  });
}
function applyRelated(record, changes) {
  const groups = record.children;
  for (const change of changes ?? []) {
    let rows = groups[change.resource] ?? [];
    rows = rows.filter(row => !change.removed.includes(row.id));
    change.modified.forEach(item => {
      Object.assign(
        rows.find(row => row.id === item.recordKey),
        item.values
      );
    });
    change.inserted.forEach(item => {
      rows.push({ ...item.values, id: String(++nextId) });
    });
    groups[change.resource] = rows;
  }
}
const port: CrudPort = {
  describe: async () => structuredClone(schema),
  relatedComplete: () => true,
  list: async () => ({
    rows: structuredClone(records.filter(row => !row.deletedAt)),
    totalRows: records.filter(row => !row.deletedAt).length
  }),
  detail: async id => structuredClone(records.find(row => row.id === id)),
  create: async (values, options) => {
    const row = {
      ...values,
      id: String(++nextId),
      version: 1,
      children: { items: [], notes: [], tags: [] }
    };
    applyRelated(row, options.relatedChanges);
    records.push(row);
    event.value = "已由测试适配口一次提交主表与明细";
    return row;
  },
  update: async (current, values, options) => {
    const row = records.find(row => row.id === current.id);
    if (conflict.value || row.version !== current.version)
      throw failure(409, "数据已被他人修改，请刷新");
    if (lineError.value) {
      const change = options.relatedChanges.find(
        group => group.resource === "items"
      );
      throw failure(400, "明细有误，请修正标红的行", {
        errors: [
          {
            resource: "items",
            ...(change.inserted.length
              ? { clientId: change.inserted[0].localKey }
              : { id: "10" }),
            field: "qty",
            messages: ["数量超过本次可用范围"]
          }
        ]
      });
    }
    const body = {
      id: current.id,
      version: current.version,
      ...bodyFor(values, options)
    };
    event.value = `提交旧版本 ${current.version}；修改 ${body.children.items?.updated.length ?? 0} 行，新增 ${body.children.items?.added.length ?? 0} 行，删除 ${body.children.items?.deleted.length ?? 0} 行`;
    Object.assign(row, values, { version: Number(row.version) + 1 });
    applyRelated(row, options.relatedChanges);
    return row;
  },
  remove: async ids => {
    records
      .filter(row => ids.includes(String(row.id)))
      .forEach(row => {
        row.deletedAt = new Date().toISOString();
        row.version = Number(row.version) + 1;
      });
  },
  recycled: async () => ({
    rows: structuredClone(records.filter(row => row.deletedAt)),
    totalRows: records.filter(row => row.deletedAt).length
  }),
  restore: async items => {
    if (conflict.value) throw failure(409, "回收站版本已变化，请刷新");
    for (const item of items) {
      const row = records.find(row => row.id === item.id);
      if (row.version !== item.version) throw failure(409, "版本冲突");
    }
    items.forEach(item => {
      const row = records.find(row => row.id === item.id);
      delete row.deletedAt;
      row.version = Number(row.version) + 1;
    });
    event.value = `恢复请求包含 id/version：${JSON.stringify(items)}`;
  },
  purge: async items => {
    event.value = `彻底删除请求包含 id/version：${JSON.stringify(items)}`;
    for (const item of items) {
      const index = records.findIndex(
        row => row.id === item.id && row.version === item.version
      );
      if (index < 0) throw failure(409, "版本冲突");
      records.splice(index, 1);
    }
  }
};
</script>
<template>
  <main class="aggregate-shell">
    <header>
      <div>
        <h1>主子表与回收站</h1>
        <small>独立验收入口 · 合成数据</small>
      </div>
      <div class="test-controls">
        <el-checkbox v-model="lineError">模拟明细错误</el-checkbox
        ><el-checkbox v-model="conflict">模拟版本冲突</el-checkbox
        ><el-button @click="resetSessionViews">清空会话视图</el-button
        ><el-button @click="page.reload()">重新加载</el-button>
      </div>
    </header>
    <output>{{ event }}</output
    ><CrudPage
      ref="page"
      :port="port"
      page-key="test-orders"
      :permissions="perms"
    />
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
.aggregate-shell {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px;
  background: #f4f6f9;
  gap: 12px;
}
.aggregate-shell > header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
.aggregate-shell h1 {
  margin: 0 0 4px;
  font-size: 22px;
}
.aggregate-shell small,
.aggregate-shell output {
  font-size: 13px;
  color: #606266;
}
.test-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}
.aggregate-shell > .crud-page {
  flex: 1;
}
@media (max-width: 760px) {
  .aggregate-shell {
    padding: 8px;
  }
  .aggregate-shell h1 {
    font-size: 18px;
  }
}
</style>
