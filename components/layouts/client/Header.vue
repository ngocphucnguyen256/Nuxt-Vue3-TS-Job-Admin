<template>
  <div>
    <div class="border-bottom border-b-1 relative">
      <!-- back btn -->
      <v-btn
        variant="elevated"
        class="border-0 header-back-btn"
        @click="router.back()"
      >
        <v-icon>mdi-account-circle-outline</v-icon>
      </v-btn>
      <h5 class="text-center">
        {{ title }}
      </h5>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: false,
    default: "",
  },
});

const router = useRouter();
</script>

<style lang="scss" scoped>
.header-back-btn {
  position: absolute;
  left: 5px;
  top: 0;
  bottom: 0;
  width: 40px;
  height: 100%;
  font-size: 20px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.relative {
  position: relative;
}
</style>
