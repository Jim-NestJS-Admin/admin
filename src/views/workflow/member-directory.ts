import { api } from "@/api/client";
import type { MemberDirectory } from "@/components/MemberPicker/types";

/** 只使用审批最小目录权限，不要求额外开放用户管理或角色管理接口。 */
export const workflowMemberDirectory: MemberDirectory = {
  async organizations(signal) {
    return (await api.workflowDirectoryOrganizations({}, { signal })).data.list;
  },
  async members({ signal, ...query }) {
    return (
      await api.workflowDirectoryPage(
        { body: { kind: "users", ...query } },
        { signal }
      )
    ).data;
  },
  async resolve(ids, signal) {
    if (!ids.length) return [];
    return (
      await api.workflowDirectoryPage(
        {
          body: {
            kind: "users",
            ids,
            keyword: "",
            includeChildren: false,
            page: 1,
            size: 50
          }
        },
        { signal }
      )
    ).data.list;
  }
};
