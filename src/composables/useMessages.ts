import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getMessages } from '@/api/messages'
import { useWebSocket } from '@vueuse/core'
import { useAuthStore } from '@/stores/auth'
import config from '@/config'

export function useMessages() {
  const route = useRoute()
  const authStore = useAuthStore()
  const { data, send } = useWebSocket(
    `${config.ws.baseURL}/channels/${route.params.channelId}/messages?${authStore.token}`,
  )
  const messages = ref([])

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

  function sendMessage(message) {
    send(JSON.stringify({ message }))
  }

  return { messages, sendMessage }
}
