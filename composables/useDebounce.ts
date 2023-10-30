import { ref, onBeforeUnmount } from "vue";

export function useDebounce(delay: number) {
  let timeout: number;

  function debounce(func: Function) {
    clearTimeout(timeout);
    timeout = setTimeout(func, delay);
  }

  onBeforeUnmount(() => {
    clearTimeout(timeout);
  });

  return debounce;
}
