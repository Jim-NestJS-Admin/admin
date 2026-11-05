import { shallowRef, watchEffect, type Directive } from "vue";
import { hasPerms } from "@/utils/auth";
const bindings = new WeakMap<
  HTMLElement,
  { value: ReturnType<typeof shallowRef>; stop: () => void }
>();
export const perm: Directive<HTMLElement, string | string[]> = {
  beforeMount(el, binding) {
    const value = shallowRef(binding.value);
    const display = el.style.getPropertyValue("display"),
      priority = el.style.getPropertyPriority("display");
    const hidden = el.hidden,
      inert = el.inert;
    const stop = watchEffect(() => {
      const allowed = hasPerms(value.value);
      el.hidden = hidden || !allowed;
      el.inert = inert || !allowed;
      if (!allowed) {
        el.style.setProperty("display", "none", "important");
        el.setAttribute("aria-hidden", "true");
      } else {
        if (display) el.style.setProperty("display", display, priority);
        else el.style.removeProperty("display");
        el.removeAttribute("aria-hidden");
      }
    });
    bindings.set(el, { value, stop });
  },
  updated(el, binding) {
    const state = bindings.get(el);
    if (state) state.value.value = binding.value;
  },
  unmounted(el) {
    bindings.get(el)?.stop();
    bindings.delete(el);
  }
};
