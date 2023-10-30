<script lang="ts" setup>
import { ref, computed } from "vue";

interface Props {
  modelValue: string | number | null;
  isHorizontal?: boolean;
  name?: string;
  disabled?: boolean;
  typePassword?: boolean;
  rules?: Array<any>;
  hideDetails?: boolean | "auto";
  type?: string;
  appendInnerIcon?: string;
  loading?: boolean;
  readonly?: boolean;
  hideRequired?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  isHorizontal: false,
  name: "",
  disabled: false,
  typePassword: false,
  hideDetails: "auto",
  rules: () => [],
  type: "text",
  appendInnerIcon: "",
  loading: false,
  readonly: false,
  hideRequired: false,
});

const emits = defineEmits(["update:model-value"]);

const value = computed({
  get: () => props.modelValue,
  set: (newValue) => {
    emits("update:model-value", newValue);
  },
});
const isHorizontal = computed(() => props.isHorizontal);
const name = computed(() => props.name);
const disabled = computed(() => props.disabled);
const typePassword = computed(() => props.typePassword);
const rules = computed(() => props.rules);
const showPass = ref(false);
const hideDetails = computed(() => props.hideDetails);
const appendInnerIcon = computed(() => props.appendInnerIcon);
const loading = computed(() => props.loading);
const readonly = computed(() => props.readonly);

const type = computed(() => {
  if (typePassword.value) {
    return showPass.value ? "text" : "password";
  }
  return props.type;
});
</script>

<template>
  <div :class="[{ 'input-horizontal': isHorizontal }, 'custom-input']">
    <p :class="[{ require: hideRequired ? false : rules.length !== 0 }]">
      {{ name }}
    </p>
    <v-text-field
      v-model="value"
      bg-color="white"
      :hide-details="hideDetails"
      no-deformation
      :readonly="readonly"
      :disabled="disabled"
      :type="type"
      variant="outlined"
      :rules="rules"
      class="mt-1"
      :append-inner-icon="
        typePassword ? (showPass ? 'mdi-eye' : 'mdi-eye-off') : appendInnerIcon
      "
      :loading="loading"
      @click:append-inner="
        typePassword ? (showPass = !showPass) : appendInnerIcon
      "
    />
  </div>
</template>
