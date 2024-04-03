<template>
  <AdminLayout>
    <div class="rounded-lg bg-white p-30">
      <h3>
        {{ titleH2 }}
      </h3>
      <!-- /.title head-->
      <v-container>
        <InputField
          name="Room name"
          :model-value="newRoomName"
          class="mb-2"
          @update:model-value="newRoomName = $event"
        />
        <v-row class="mt-4 mb-2" align="center">
          <v-col cols="2">
            <v-btn color="primary" @click="crateChatRoom">Create room</v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-card-title>Chat rooms</v-card-title>
              <v-card-text>
                <v-list>
                  <v-list-item-group>
                    <v-list-item
                      v-for="room in chatRooms"
                      :key="room.id"
                      @click="handleToDetail(room.id)"
                    >
                      <v-list-item-content>
                        <v-list-item-title>{{ room.name }}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </AdminLayout>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useChatStore } from "~/stores/chat.module";

const chatStore = useChatStore();

const router = useRouter();

const titleH2 = "Chat app";

const newRoomName = ref("");

const chatRooms = ref<
  Array<{ id: string; name: string; createdAt: string; updatedAt: string }>
>([]);

const crateChatRoom = async () => {
  if (newRoomName.value === "") return;

  const res = await chatStore.createChatRoom({ name: newRoomName.value });
  if (res) {
    chatRooms.value.push(res);
  }
};

const handleToDetail = (id: any) => {
  router.push("/admin/chat/detail" + "?id=" + id);
};

onMounted(async () => {
  const res = await chatStore.getAllChatRooms();
  chatRooms.value = res;
});
</script>
