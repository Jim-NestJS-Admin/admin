import {
  inject,
  provide,
  onMounted,
  onBeforeUnmount,
  type InjectionKey
} from "vue";
import { useTimeZones } from "./useTimeZones";
const directoryKey: InjectionKey<ReturnType<typeof useTimeZones>> = Symbol(
  "code-rule-time-zones"
);
/** 页面只加载一份目录，弹窗及所有列表单元格共同使用，子组件关闭不清空共享数据。 */
export function provideTimeZoneDirectory() {
  const directory = useTimeZones();
  provide(directoryKey, directory);
  onMounted(directory.load);
  onBeforeUnmount(directory.dispose);
  return directory;
}
export function useTimeZoneDirectory() {
  return inject(directoryKey, undefined) ?? provideTimeZoneDirectory();
}
