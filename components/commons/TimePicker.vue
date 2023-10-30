<template>
  <div class="custom-input">
    <p :class="[{ require: rules.length !== 0 }]">
      {{ props.title }}
    </p>
  </div>
  <div class="text-center">
    <v-dialog v-model="dialog" width="300">
      <template #activator="{ props }">
        <v-text-field
          v-model="displayText"
          readonly
          no-deformation
          variant="outlined"
          bg-color="white"
          class="mt-1"
          dense
          v-bind="props"
        ></v-text-field>
      </template>

      <v-card>
        <v-row class="mr-2 ml-2 mt-2 mb-2 pt-2 rounded-lg">
          <v-col>
            <v-select
              v-model="valueHour"
              bg-color="white"
              :items="itemsHour"
              class="mt-1"
              variant="outlined"
              :disabled="disabled"
              :rules="rules"
            />
          </v-col>
          <v-col cols="1">
            <div class="mt-2 text-h5 d-flex align-center justify-center">:</div>
          </v-col>
          <v-col>
            <v-select
              v-model="valueMinute"
              bg-color="white"
              :items="itemsMinute"
              class="mt-1"
              variant="outlined"
              :disabled="disabled"
              :rules="rules"
            />
          </v-col>
        </v-row>
        <v-card-actions class="d-flex flex-row-reverse">
          <v-btn color="primary" @click="dialog = false">OK</v-btn>
          <v-btn color="primary" @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface Props {
  modelValue: string;
  title?: string;
  disabled?: boolean;
  rules?: Array<any>;
  min?: number;
  type?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  title: "",
  disabled: false,
  rules: () => [],
  min: undefined,
  type: "",
});

const min = computed(() => {
  if (props.min) {
    return props.min;
  }
  return undefined;
});

const dialog = ref(false);

let itemsHour: any[] = [];
let itemsMinute: any[] = [];

const itemsHourDefault = [
  { value: "00", title: "00" },
  { value: "01", title: "01" },
  { value: "02", title: "02" },
  { value: "03", title: "03" },
  { value: "04", title: "04" },
  { value: "05", title: "05" },
  { value: "06", title: "06" },
  { value: "07", title: "07" },
  { value: "08", title: "08" },
  { value: "09", title: "09" },
  { value: "10", title: "10" },
  { value: "11", title: "11" },
  { value: "12", title: "12" },
  { value: "13", title: "13" },
  { value: "14", title: "14" },
  { value: "15", title: "15" },
  { value: "16", title: "16" },
  { value: "17", title: "17" },
  { value: "18", title: "18" },
  { value: "19", title: "19" },
  { value: "20", title: "20" },
  { value: "21", title: "21" },
  { value: "22", title: "22" },
  { value: "23", title: "23" },
];

const itemsHourCus = [
  { value: "00", title: "00" },
  { value: "01", title: "01" },
  { value: "02", title: "02" },
  { value: "03", title: "03" },
];

const itemsMinuteDefault = [
  { value: "00", title: "00" },
  { value: "05", title: "05" },
  { value: "10", title: "10" },
  { value: "15", title: "15" },
  { value: "20", title: "20" },
  { value: "25", title: "25" },
  { value: "30", title: "30" },
  { value: "35", title: "35" },
  { value: "40", title: "40" },
  { value: "45", title: "45" },
  { value: "50", title: "50" },
  { value: "55", title: "55" },
];

const itemsMinuteCus = [
  { value: "00", title: "00" },
  { value: "15", title: "15" },
  { value: "30", title: "30" },
  { value: "45", title: "45" },
];

const emits = defineEmits(["update:model-value"]);

function setValueDisplayText() {
  displayText.value = `${valueHour.value.value}:${valueMinute.value.value}:00`;
  emits("update:model-value", displayText.value);
}

const displayText = ref(props.modelValue);

watch(
  () => props.modelValue,
  (value) => {
    if (value) {
      displayText.value = value;
    } else {
      displayText.value = "00:00:00";
    }
  },
);

const valueHour = computed({
  get: () => ref(itemsHour[0].value),
  set: (newValue) => {
    setValueDisplayText();
  },
});

const valueMinute = computed({
  get: () => ref(itemsMinute[0].value),
  set: (newValue) => {
    setValueDisplayText();
  },
});

function setData() {
  itemsHour = itemsHourDefault;
  itemsMinute = itemsMinuteDefault;
  if (props.type && props.type === "custom") {
    itemsHour = itemsHourCus;
    itemsMinute = itemsMinuteCus;
  }
}

onMounted(() => {
  setData();
});
</script>
