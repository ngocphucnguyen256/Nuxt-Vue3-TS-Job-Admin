<template>
  <h4 v-if="project.project_name" class="mb-3 font-weight-bold">
    {{ project.project_name }}
  </h4>
  <p v-if="isHaveAddress" class="mb-1">
    住所: {{ project.street_name }} <span v-if="project.city">,</span>
    {{ project.city }}<span v-if="project.province">,</span>
    {{ project.province }}
  </p>
  <p v-if="project.start_day || project.end_day" class="mb-1">
    労働時間: {{ project.start_day }}
    <span v-if="project.start_day && project.end_day">~</span>
    {{ project.end_day }}
  </p>
  <p v-if="project.notes" class="mb-1">ノート: {{ project.notes }}</p>
  <p v-for="(item, index) in projectSalary" :key="index" class="mb-1">
    {{ handleReturnSalary(item) }}
  </p>
</template>

<script setup lang="ts">
import { projectDetailType, SalaryType } from "types/payload-type";
import { SALARY_TYPE } from "~/utils/consts/const";

interface Props {
  project?: projectDetailType;
}

const props = withDefaults(defineProps<Props>(), {
  project: () => {
    return {} as projectDetailType;
  },
});

const isHaveAddress = computed(() => {
  return (
    props.project.street_name || props.project.city || props.project.province
  );
});

const projectSalary = computed(() => {
  return props.project.salary || props.project.salarys || [];
});

const handleReturnSalary = (salary: SalaryType) => {
  if (typeof salary.type === "string") {
    salary.type = parseInt(salary.type);
  }
  if (salary.type === SALARY_TYPE.DAY.value) {
    return `${SALARY_TYPE.DAY.label}: ${salary.wage}円`;
  }
  return `${SALARY_TYPE.HOUR.label}: ${salary.wage}円`;
};
</script>

<style scoped></style>
