import { login as apiLogin } from '@/api/auth'
import { useAuthStore } from '@/stores/auth'

export function useAuth() {
  const authStore = useAuthStore()

  async function login(username: string, password: string) {
    const token = await apiLogin(username, password)
    authStore.token = token
  }

  function logout() {
    authStore.token = ''
  }

  function isAuthenticated() {
    return authStore.token !== ''
  }

  return { login, logout, isAuthenticated }
}
