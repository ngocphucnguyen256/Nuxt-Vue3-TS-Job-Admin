<template>
  <div v-if="message">
    <v-alert
      icon="mdi-information-outline"
      :text="message"
      :type="success ? 'success' : 'error'"
      variant="outlined"
      class="mb-9 pt-2 pb-2 mt-8"
    ></v-alert>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message: string;
  success?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  message: "",
  success: false,
});

const message = computed(() => {
  return props.message;
});
</script>

<style lang="scss" scoped></style>
