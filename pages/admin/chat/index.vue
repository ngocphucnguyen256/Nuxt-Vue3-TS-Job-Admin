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
              <div>{{ message.sender }}: {{ message.text }}</div>
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
import { ref } from "vue";

const titleH2 = "Chat app";
const newMessage = ref("");
const messages = ref([
  { sender: "Dude", text: "Hello", id: 1 },
  { sender: "You", text: "Hi", id: 2 },
  { sender: "Dude", text: "How are you?", id: 3 },
]);

const sendMessage = () => {
  if (newMessage.value === "") return;
  messages.value.push({
    sender: "You",
    text: newMessage.value,
    id: messages.value.length + 1,
  });
  newMessage.value = "";
};
</script>
