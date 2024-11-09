import config from '@/config'
import { useAuthStore } from '@/stores/auth'

export async function getChannels() {
  const authStore = useAuthStore()

  const response = await fetch(`${config.api.baseURL}/channels`, {
    method: 'GET',
    headers: {
      Authorization: `Token ${authStore.token}`,
      'Content-Type': 'application/json',
    },
  })
  const responseJson = await response.json()

  return responseJson['results']
}
