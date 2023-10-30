<template>
  <AdminLayout>
    <v-card>
      <v-banner>
        {{ titleH4 }}
      </v-banner>
      <v-card-text>
        <Bar v-if="spinning" :data="chartData" :options="chartOptions" />
      </v-card-text>
    </v-card>
  </AdminLayout>
</template>

<script setup lang="ts">
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ChartData,
  // @ts-ignore
} from "chart.js";

import { Bar } from "vue-chartjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const titleH4 = "2023";
const spinning = ref(false);

const chartData = ref(getDataChart());
const chartOptions = ref(getOptionChart());

onMounted(() => {
  getDetailChart();
});

function getDataChart() {
  const data: ChartData<"bar", (number | [number, number] | null)[]> = {
    labels: [], // Array of string labels
    datasets: [
      {
        type: "bar",
        data: [], // Array of numbers or an array of [number, number] or null (matching the type)
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(54, 162, 235, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(54, 162, 235, 0.2)",
        ],
        borderWidth: 1,
      },
    ],
  };
  return data;
}

function getOptionChart() {
  return {
    responsive: true,
  };
}

function getDetailChart() {
  spinning.value = false;
  chartData.value.labels = ["1", "2", "3", "4"];
  chartData.value.datasets[0].data = [40, 70, 70, 70];
  spinning.value = true;
}
</script>
