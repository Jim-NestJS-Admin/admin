// 通知模块接入前保持真实空状态，不保留演示消息。
export interface ListItem {
  avatar: string;
  title: string;
  datetime: string;
  type: string;
  description: string;
  status?: "primary" | "success" | "warning" | "info" | "danger";
  extra?: string;
}
export interface TabItem {
  key: string;
  name: string;
  list: ListItem[];
  emptyText: string;
}
export const noticesData: TabItem[] = [];
