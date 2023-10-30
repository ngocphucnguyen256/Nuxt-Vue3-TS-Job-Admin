<script lang="ts" setup>
import { ref, computed } from "vue";

interface Props {
  value: Array<string | number>;
  isHorizontal?: boolean;
  name: string;
  rules?: Array<any>;
  hideDetails?: boolean | "auto";
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  value: () => [],
  isHorizontal: false,
  name: "",
  rules: () => [],
  hideDetails: "auto",
  disabled: false,
});

const emits = defineEmits(["update:model-value"]);

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

const isRequired = computed(() => {
  return rules.value.some((fnc) => fnc.name === "required");
});
</script>

<template>
  <div
    :class="[
      { 'select-horizontal': isHorizontal },
      'custom-selectbox',
      'custom-input',
    ]"
  >
    <p :class="isRequired && 'require'">
      {{ name }}
    </p>
    <v-combobox
      v-model="value"
      :hide-no-data="false"
      hide-selected
      multiple
      bg-color="white"
      :hide-details="hideDetails"
      chips
      closable-chips
      :rules="rules"
      variant="outlined"
      class="mt-1"
      :disabled="disabled"
    >
      <template #no-data>
        <v-list-item>
          <v-list-item-title>
            Press <kbd>enter</kbd> to create a new one
          </v-list-item-title>
        </v-list-item>
      </template>
    </v-combobox>
  </div>
</template>
