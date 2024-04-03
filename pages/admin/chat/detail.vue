<template>
  <AdminLayout>
    <div class="rounded-lg bg-white p-30">
      <h3>
        {{ titleH2 }}
      </h3>
      <!-- /.title head-->
      <v-container>
        <v-card class="pa-5 mb-4" max-height="400" overflow-y="auto">
          <div v-for="message in messages" :key="message.id" class="my-2">
            <v-card class="pa-3" outlined tile>
              <div>{{ message.senderId }}: {{ message.content }}</div>
            </v-card>
          </div>
        </v-card>
        <v-row class="mt-4 mb-2" align="center">
          <v-col cols="10">
            <TextareaField
              name="New message"
              :model-value="newMessage"
              @update:model-value="newMessage = $event"
            />
          </v-col>
          <v-col cols="2">
            <v-btn color="primary" @click="sendMessage">Send</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </AdminLayout>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useChatStore } from "~/stores/chat.module";

const chatStore = useChatStore();
const router = useRouter();

const titleH2 = "Chat app";
const newMessage = ref("");
const messages = ref<
  Array<{
    id: string;
    senderId: string;
    content: string;
  }>
>([]);

const id = router.currentRoute.value.query.id;

const getData = async () => {
  const res = await chatStore.getMessageInRoom({ chatRoomId: id });
  if (res) {
    messages.value = res;
  }
};

onMounted(async () => {
  await getData();
});

const sendMessage = async () => {
  if (newMessage.value === "") return;
  const res = await chatStore.sendMessage({
    chatRoomId: id,
    content: newMessage.value,
  });
  if (res) {
    await getData();
  }
};
</script>
