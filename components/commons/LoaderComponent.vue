<template>
  <div
    v-if="loading"
    :class="[center && 'd-flex justify-center align-center w-1/1']"
  >
    <v-progress-circular :size="size" :indeterminate="true" :color="color" />
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: number;
  color?: string;
  center?: boolean;
  loading: boolean;
  redirect?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: 50,
  color: "primary",
  center: true,
  loading: false,
  redirect: false,
});

const router = useRouter();
const timeoutId = ref();

const handleLoadingChange = (loading: boolean) => {
  if (loading && props.redirect) {
    timeoutId.value = setTimeout(() => {
      router.push("/error");
    }, 30000);
  } else {
    clearTimeout(timeoutId.value);
  }
};

onMounted(() => {
  handleLoadingChange(props.loading);
});

onUnmounted(() => {
  clearTimeout(timeoutId.value);
});

watch(() => props.loading, handleLoadingChange);
</script>

<style scoped lang="scss">
.v-progress-circular {
  margin: 1rem;
}
</style>
