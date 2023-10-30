<template>
  <div
    :class="[
      { 'range-picker-horizontal': isHorizontal },
      { 'justify-center': justify === 'center' },
      { 'justify-start': justify === 'start' },
      { 'justify-end': justify === 'end' },
      'custom-range-picker custom-input custom-selectbox',
    ]"
  >
    <p :class="[{ require: rules.length !== 0 }]">
      {{ name }}
    </p>
    <div class="range-picker-detail d-flex mt-1">
      <div :class="['min-width-date', widthFull && 'w-100']">
        <v-menu
          v-model="menu1"
          v-model:return-value="getStartDate"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template #activator="{ props: props1 }">
            <v-text-field
              v-model="displayText1"
              readonly
              no-deformation
              variant="outlined"
              hide-details
              bg-color="white"
              dense
              v-bind="props1"
            />
          </template>
          <v-date-picker
            v-model="getStartDate"
            no-title
            scrollable
            @click:cancel="menu1 = false"
            @click:save="menu1 = false"
          >
          </v-date-picker>
        </v-menu>
      </div>
      <div class="mx-2 bg-white">~</div>
      <div :class="['min-width-date', widthFull && 'w-100']">
        <v-menu
          v-model="menu2"
          v-model:return-value="getEndDate"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template #activator="{ props: props2 }">
            <v-text-field
              v-model="displayText2"
              readonly
              no-deformation
              variant="outlined"
              dense
              bg-color="white"
              hide-details
              v-bind="props2"
            />
          </template>
          <v-date-picker
            v-model="getEndDate"
            no-title
            scrollable
            :min="min"
            @click:cancel="menu2 = false"
            @click:save="menu2 = false"
          >
          </v-date-picker>
        </v-menu>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  startDate: Date | string;
  endDate: Date | string;
  name?: string;
  isHorizontal?: boolean;
  justify?: string;
  rules?: Array<any>;
  widthFull?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  startDate: "",
  endDate: "",
  name: "",
  isHorizontal: false,
  justify: "center",
  rules: () => [],
  widthFull: false,
});

const menu1 = ref(false);
const menu2 = ref(false);
const getStartDate = ref();
const getEndDate = ref();
const justify = computed(() => props.justify);
const rules = computed(() => props.rules);

const min = computed(() => {
  if (getStartDate.value instanceof Date) {
    return getStartDate.value.getTime();
  }
  return undefined;
});

function init() {
  getStartDate.value = props.startDate;
  getEndDate.value = props.endDate;
}

const emits = defineEmits([
  "update:model-value-start-date",
  "update:model-value-end-date",
]);

const handleEmitStartDate = () => {
  emits("update:model-value-start-date", destructDate(getStartDate.value));
};

const handleEmitEndDate = () => {
  emits("update:model-value-end-date", destructDate(getEndDate.value));
};

watch(() => props.startDate, handleWatchPropsStartDate, { immediate: true });
watch(() => props.endDate, handleWatchPropsEndDate, { immediate: true });

// sync props with v-model
watch(() => getStartDate.value, handleEmitStartDate, { immediate: true });
watch(() => getEndDate.value, handleEmitEndDate, { immediate: true });

function handleWatchPropsStartDate() {
  init();
}

function handleWatchPropsEndDate() {
  init();
}

function handleFormatDisplayText(refValue: any) {
  if (refValue) {
    if (Array.isArray(refValue)) {
      refValue = refValue[0];
    }
    if (refValue instanceof Date) {
      return refValue.toLocaleDateString("ja-JP");
    }
  }
  return "";
}

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

const displayText1 = computed(() => {
  return handleFormatDisplayText(getStartDate.value);
});

const displayText2 = computed(() => {
  return handleFormatDisplayText(getEndDate.value);
});
</script>

<style scoped lang="scss">
.min-width-date {
  min-width: 120px;
}
</style>
