export function useLoadingDialog() {
  const showDialog = ref(false);
  const loading = ref(false);
  const isSuccessful = ref(false);
  const message = ref("");

  const startLoadingDialog = () => {
    showDialog.value = true;
    loading.value = true;
  };

  const endLoadingDialog = () => {
    loading.value = false;
    setTimeout(() => {
      showDialog.value = false;
    }, 2000);
  };

  const setSuccessDialog = (value: boolean, text: string) => {
    isSuccessful.value = value;
    message.value = text;
  };

  return {
    loading,
    showDialog,
    isSuccessful,
    message,
    startLoadingDialog,
    endLoadingDialog,
    setSuccessDialog,
  };
}
