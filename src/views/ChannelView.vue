<template>
  <AppLayout>
    <template #header>
      <h1>Messages</h1>
    </template>
    <template #default>
      <div>
        <ul>
          <li v-for="(message, index) in messages" :key="index">
            {{ message.username }}: {{ message.content }}
          </li>
        </ul>
        <textarea
          class="new-message"
          v-model="newMessage"
          @keypress.enter.prevent="newMessageHandler"
        ></textarea>
      </div>
    </template>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppLayout from '@/layouts/AppLayout.vue'
import { useMessages } from '@/composables/useMessages'

const newMessage = ref('')
const { messages, sendMessage } = useMessages()

function newMessageHandler() {
  sendMessage(newMessage.value)
  newMessage.value = ''
}
</script>

<style scoped>
.new-message {
  margin-top: 2rem;
  width: 100%;
  height: 50px;
}
</style>
