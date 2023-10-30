export function useErrorLine() {
  const message = ref("");
  const isSuccess = ref(false);

  const setDataErrorLine = (messageParam = "", isSuccessParam: boolean) => {
    message.value = messageParam;
    isSuccess.value = isSuccessParam;
  };

  return {
    message,
    isSuccess,
    setDataErrorLine,
  };
}
