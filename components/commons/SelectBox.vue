<script lang="ts" setup>
import { ref, computed } from "vue";

interface Props {
  items: Array<{ title: string; value: string | number }>;
  value: string | number;
  isHorizontal?: boolean;
  name: string;
  rules?: Array<any>;
  hideDetails?: boolean | "auto";
  disabled?: boolean;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  value: "",
  isHorizontal: false,
  name: "",
  rules: () => [],
  hideDetails: "auto",
  disabled: false,
  loading: false,
});

const emits = defineEmits(["update:model-value"]);

const items = computed(() => props.items);
const value = computed({
  get: () => props.value,
  set: (newValue) => {
    emits("update:model-value", newValue);
  },
});
const isHorizontal = computed(() => props.isHorizontal);
const name = computed(() => props.name);
const rules = computed(() => props.rules);
const hideDetails = computed(() => props.hideDetails);
const disabled = computed(() => props.disabled);
const loading = computed(() => props.loading);

onMounted(() => {
  value.value = props.value;
});
</script>

<template>
  <div
    :class="[
      'custom-selectbox',
      { 'select-horizontal': isHorizontal },
      'custom-input',
    ]"
  >
    <p :class="[{ require: rules.length !== 0 }]">
      {{ name }}
    </p>
    <v-select
      v-model="value"
      bg-color="white"
      :hide-details="hideDetails"
      :items="items"
      class="mt-1"
      variant="outlined"
      :disabled="disabled"
      :rules="rules"
      :loading="loading"
    />
  </div>
</template>
