<template>
  <v-dialog
    v-model="dialog"
    :scrim="true"
    width="auto"
    :close-on-content-click="true"
    :close-on-back="true"
  >
    <v-card color="primary" density="comfortable" class="px-4 py-4">
      <v-card-text v-if="loading">
        お待ちください
        <v-progress-linear
          indeterminate
          color="white"
          class="mb-0"
        ></v-progress-linear>
      </v-card-text>
      <v-card-text v-else>
        <div v-if="isSuccessful">
          <v-icon color="white">mdi-check</v-icon>
          <span class="ml-2 white--text">{{ message }}</span>
        </div>
        <div v-else>
          <v-icon color="white">mdi-alert</v-icon>
          <span class="ml-2 white--text">{{ message }}</span>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
interface Props {
  dialog: boolean;
  loading: boolean;
  isSuccessful?: boolean;
  message?: string;
}

const props = withDefaults(defineProps<Props>(), {
  dialog: true,
  loading: false,
  isSuccessful: false,
  message: "",
});

const dialog = computed(() => props.dialog);

const router = useRouter();
const loading = computed(() => props.loading);
const isSuccessful = computed(() => props.isSuccessful);
const message = computed(() => props.message);
const timeoutId = ref();

const handleLoadingChange = (loading: boolean) => {
  if (loading) {
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
