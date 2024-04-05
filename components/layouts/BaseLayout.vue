<script lang="ts" setup>
import { ref } from "vue";
import { useAuthStore } from "~/stores/auth.module";

const authStore = useAuthStore();

interface Props {
  clipped?: boolean;
  drawer?: boolean;
  items?: { title: string; to: string }[];
  miniVariant?: boolean;
  isClient?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  clipped: false,
  drawer: true,
  items: () => [],
  miniVariant: false,
  isClient: false,
});

const drawer = ref(props.drawer);

const router = useRouter();

const email = computed(() => authStore.auth.user?.email || "");

const toChangePassword = () => {
  router.push("/staff/change-password");
};
</script>

<template>
  <v-app class="drawer-overlay-admin bg-default">
    <v-app-bar elevation="0" fixed app class="bg-darker">
      <v-btn v-if="props.isClient" class="md-hidden" icon @click="$router.back">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <nuxt-link
        :class="['h-75', 'w-auto', !props.isClient && 'ml-2']"
        :to="props.isClient ? '/staff/my-page' : '/admin/dashboard'"
      >
        <!-- <img :src="" alt="logo" :class="['h-100', 'w-auto']" /> -->
      </nuxt-link>
      <div class="ml-auto d-flex align-center">
        <v-btn
          variant="text"
          prepend-icon="mdi-account-circle-outline"
          class="bg-white sm-hidden"
          rounded="xl"
          @click="toChangePassword"
        >
          {{ email }}
        </v-btn>
        <v-btn class="ml-1" icon @click="drawer = !drawer">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
      </div>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="props.miniVariant"
      :clipped="props.clipped"
      fixed
      app
      class="ml-2 bg-blue"
    >
      <v-list class="pt-0">
        <v-list-item
          v-for="(item, i) in props.items"
          :key="i"
          :to="item.to"
          router
          exact
          prepend-icon="mdi-view-dashboard-outline"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main class="grey-lighten-5">
      <v-container class="pa-6">
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped lang="scss">
.bg-blue {
  background-color: hsl(292, 82%, 40%) !important;
}

.bg-default {
  background-color: #f5f5f5;
}

.bg-darker {
  background-color: #d1d1d1;
}

//not last child
.v-list > .v-list-item:not(:last-child) {
  border-bottom: 1px solid white !important;
}
.v-list-item {
  padding: 15px 30px !important;
}
</style>
