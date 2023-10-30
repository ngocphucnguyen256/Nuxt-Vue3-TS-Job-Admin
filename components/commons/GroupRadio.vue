<script lang="ts" setup>
interface Props {
  items: Array<{ title: string; value: string | number }>;
  value: string | number | null;
  name: string;
  rules?: Array<any>;
  isHorizontal?: boolean;
  hideDetails?: boolean | "auto";
  fontBold?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  value: null,
  name: "",
  isHorizontal: true,
  rules: () => [],
  hideDetails: "auto",
  fontBold: false,
});

const emits = defineEmits(["update:model-value"]);

const items = computed(() => props.items);

const value = computed({
  get: () => props.value,
  set: (newValue) => {
    emits("update:model-value", newValue);
  },
});

const name = computed(() => props.name);
const rules = computed(() => props.rules);
const isHorizontal = computed(() => props.isHorizontal);
</script>

<template>
  <v-radio-group
    :model-value="value"
    :rules="rules"
    :inline="isHorizontal"
    :class="[
      fontBold ? 'font-weight-bold' : '',
      'custom-radio-button custom-input -ml-8',
    ]"
    :hide-details="hideDetails"
    @update:model-value="value = $event"
  >
    <template #label>
      <p :class="[{ require: rules.length !== 0 }]">
        {{ name }}
      </p>
    </template>
    <div
      :class="[
        { 'input-horizontal': isHorizontal },
        { 'mb-2': !isHorizontal },
        'custom-input',
      ]"
    >
      <v-radio
        v-for="(item, idx) in items"
        :key="idx"
        :label="`${item.title}`"
        :value="item.value"
      />
    </div>
  </v-radio-group>
</template>

<style lang="scss">
.v-label {
  opacity: 1;
}
</style>
