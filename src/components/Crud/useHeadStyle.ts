import { computed } from "vue";
import { useGlobalSize } from "element-plus";

/**
 * 列表页标题栏高度跟随全局组件尺寸：左侧面板标题栏和右侧工具栏共用，底边线才能对齐。
 * 上下各留 8px，再加 1px 底边线；保证控件落在整数像素上，边线不发虚。
 */
export function useHeadStyle() {
  const size = useGlobalSize();
  return computed(() => {
    const control = { large: 40, default: 32, small: 24 }[size.value] ?? 32;
    return {
      "--crud-control-height": `${control}px`,
      "--crud-head-height": `${control + 17}px`
    };
  });
}
