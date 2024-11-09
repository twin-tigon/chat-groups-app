import config from '@/config'

export async function login(username: string, password: string): Promise<string> {
  const response = await fetch(`${config.api.baseURL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })
  const { token } = await response.json()

  return token
}
