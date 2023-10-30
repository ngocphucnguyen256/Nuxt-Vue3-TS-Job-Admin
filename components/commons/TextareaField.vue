<template>
  <div class="custom-input">
    <p :class="[{ require: rules.length !== 0 }]">
      {{ name }}
    </p>
    <v-textarea
      :model-value="value"
      variant="outlined"
      :readonly="readonly"
      :disabled="disabled"
      class="mt-1"
      :rows="rows"
      bg-color="white"
      :rules="rules"
      :hide-details="hideDetails"
      @update:model-value="handleUpdateValue"
    />
  </div>
</template>

<script lang="ts" setup>
interface Props {
  modelValue: string | null;
  name?: string;
  disabled?: boolean;
  rules?: any[];
  readonly?: boolean;
  rows?: number;
  hideDetails?: boolean | "auto";
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  name: "",
  disabled: false,
  rules: () => [],
  readonly: false,
  rows: 2,
  hideDetails: "auto",
});

const emits = defineEmits(["update:model-value"]);
const rows = computed(() => props.rows);

const value = computed(() => props.modelValue);

const handleUpdateValue = (newValue: string) => {
  emits("update:model-value", newValue);
};
</script>
