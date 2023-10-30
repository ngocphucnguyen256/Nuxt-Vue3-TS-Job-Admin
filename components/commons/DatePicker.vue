<template>
  <div class="custom-input">
    <p :class="[{ require: rules.length !== 0 }, 'font-size-14']">
      {{ props.title }}
    </p>
    <v-menu
      v-model="menuOpen"
      v-model:return-value="selectedDate"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      min-width="auto"
    >
      <template #activator="{ props }">
        <v-text-field
          v-model="displayText"
          readonly
          no-deformation
          variant="outlined"
          bg-color="white"
          class="mt-1"
          dense
          :hide-details="hideDetails"
          v-bind="props"
        ></v-text-field>
      </template>
      <v-date-picker
        v-model="selectedDate"
        no-title
        scrollable
        :min="min"
        @click:cancel="menuOpen = false"
        @click:save="menuOpen = false"
      ></v-date-picker>
    </v-menu>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface Props {
  modelValue: Date | string;
  title?: string;
  disabled?: boolean;
  rules?: Array<any>;
  min?: number;
  hideDetails?: boolean | "auto";
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => new Date(),
  title: "",
  disabled: false,
  rules: () => [],
  min: undefined,
  hideDetails: "auto",
});

const min = computed(() => {
  if (props.min) {
    return props.min;
  }
  return undefined;
});

const selectedDate = ref(Array<Date | string>(props.modelValue));
const hideDetails = computed(() => {
  if (props.hideDetails) {
    return props.hideDetails;
  }
  return false;
});

const emits = defineEmits(["update:model-value"]);

const handleEmitSelectedDate = () => {
  emits("update:model-value", destructDate(selectedDate.value));
};

watch(() => selectedDate.value, handleEmitSelectedDate, { immediate: true });
watch(() => props.modelValue, handleWatchProp, { immediate: true });

function init() {
  selectedDate.value[0] = props.modelValue;
}

function handleWatchProp() {
  init();
}

const displayText = computed(() => {
  if (selectedDate.value && selectedDate.value.length > 0) {
    if (selectedDate.value[0] instanceof Date) {
      return selectedDate.value[0].toLocaleDateString("ja-JP");
    }
  }
  return "";
});

// destruct date from array | undefined to date | string
function destructDate(input: any[] | undefined) {
  if (input) {
    if (Array.isArray(input)) {
      input = input[0];
    }
    if (input instanceof Date) {
      return input;
    }
  }
  return "";
}

const menuOpen = ref<boolean>(false);
</script>

<style scoped lang="scss">
.font-size-14 {
  font-size: 14px;
}
</style>
