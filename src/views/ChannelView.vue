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
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getMessages } from '@/api/messages'
import { useWebSocket } from '@vueuse/core'
import { useAuthStore } from '@/stores/auth'
import AppLayout from '@/layouts/AppLayout.vue'

const route = useRoute()
const authStore = useAuthStore()
const messages = ref([])
const newMessage = ref('')
const { data, send } = useWebSocket(
  `ws://127.0.0.1:8000/ws/channels/${route.params.channelId}/messages?${authStore.token}`,
)

onMounted(async () => {
  messages.value = await getMessages(route.params.channelId)
})

watch(
  () => route.params.channelId,
  async (channelId) => {
    messages.value = await getMessages(channelId)
  },
)

watch(data, (newMessage) => {
  messages.value.push(JSON.parse(newMessage))
})

function newMessageHandler() {
  send(JSON.stringify({ message: newMessage.value }))
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
