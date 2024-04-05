<template>
  <AdminLayout>
    <div class="rounded-lg bg-white p-30">
      <h3>
        {{ titleH2 }}
      </h3>
      <!-- /.title head-->
      <v-container>
        <v-card class="pa-5 mb-4 overflow-y-scroll" max-height="400">
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
              @keydown.enter="sendMessage"
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
import { useAuthStore } from "~/stores/auth.module";

const chatStore = useChatStore();
const authStore = useAuthStore();
const router = useRouter();

const titleH2 = ref("Chat app");
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
  const res = await chatStore.getMessageInRoom({ chatRoomId: id as string });
  if (res) {
    messages.value = res;
  }
};

// WebSocket connection setup moved to a separate function for clarity
let ws: WebSocket; // Declare ws here to ensure it's accessible in your setup function scope

const connectWebSocket = () => {
  // ws = new WebSocket("ws://localhost:7100/");
  ws = new WebSocket(chatStore.getWsURL());

  ws.onopen = () => {
    console.log("WebSocket connected");
    sendJoinRoomMessage();
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("Message from server ", data);
    messages.value.push(data);
  };

  ws.onerror = (error) => {
    console.error("WebSocket error: ", error);
  };

  ws.onclose = () => {
    console.log("WebSocket disconnected");
  };
};

const sendMessage = () => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    const token = authStore.auth.access_token;
    const messageData = {
      type: "MESSAGE",
      token,
      content: newMessage.value,
      roomId: id as string,
    };
    ws.send(JSON.stringify(messageData));
    newMessage.value = "";
  } else {
    console.error("WebSocket is not connected");
  }
};

const sendJoinRoomMessage = () => {
  const token = authStore.auth.access_token;
  const joinRoomData = {
    token,
    type: "JOIN",
    roomId: id as string,
  };
  ws.send(JSON.stringify(joinRoomData));
  console.log("Room joined");
};

onMounted(async () => {
  await getData();
  connectWebSocket();
});
</script>

<style scoped>
.overflow-y-scroll {
  overflow-y: scroll;
}
</style>
