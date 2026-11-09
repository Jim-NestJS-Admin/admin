import { nextTick, onActivated, onMounted, ref, type Ref } from "vue";
import { useEventListener, useResizeObserver } from "@vueuse/core";

/**
 * 页面撑满内容区：高度 = 内容区可视高度 − 页面在内容区里的静态偏移 − 底部外边距 − 页脚。
 * 只在挂载、窗口或内容区尺寸变化时计算，滚动时不变（按滚动位置算会越滚越高，整页跟着滚）。
 */
export function useFillHeight(target: Ref<HTMLElement | undefined>, min = 320) {
  const height = ref(min);
  const measure = () => {
    const el = target.value;
    if (!el) return;
    const wrap = el.closest(".el-scrollbar__wrap") as HTMLElement | null;
    const wrapEl = el.closest(".el-scrollbar__wrap");
    // 自己和祖先（到滚动容器为止）的下外边距、祖先的下内边距，例如布局给页面根元素的 margin: 24px
    let marginBottom = 0;
    for (
      let node: HTMLElement | null = el;
      node && node !== wrapEl;
      node = node.parentElement
    ) {
      const style = getComputedStyle(node);
      marginBottom += parseFloat(style.marginBottom) || 0;
      if (node !== el) marginBottom += parseFloat(style.paddingBottom) || 0;
    }
    if (!wrap) {
      const top = el.getBoundingClientRect().top + window.scrollY;
      height.value = Math.max(min, window.innerHeight - top - marginBottom);
      return;
    }
    const offset =
      el.getBoundingClientRect().top -
      wrap.getBoundingClientRect().top +
      wrap.scrollTop;
    const footer = wrap.querySelector(".layout-footer") as HTMLElement | null;
    const footerHeight = footer ? footer.offsetHeight : 0;
    height.value = Math.max(
      min,
      Math.floor(wrap.clientHeight - offset - marginBottom - footerHeight)
    );
  };
  onMounted(() => nextTick(measure));
  onActivated(() => nextTick(measure));
  useEventListener(window, "resize", measure);
  useResizeObserver(
    () =>
      (target.value?.closest(".el-scrollbar__wrap") as HTMLElement | null) ??
      undefined,
    measure
  );
  return height;
}
