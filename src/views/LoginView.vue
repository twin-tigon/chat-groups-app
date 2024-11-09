<template>
  <div>
    <Form v-slot="$form" :initialValues :resolver @submit="onFormSubmit">
      <h1>Login</h1>
      <div>
        <InputText name="username" type="text" placeholder="Username" fluid />
        <Message v-if="$form?.username?.invalid" severity="error" size="small" variant="simple">{{
          $form.username.error.message
        }}</Message>
      </div>
      <div>
        <Password name="password" placeholder="Password" :feedback="false" toggleMask fluid />
        <Message v-if="$form?.password?.invalid" severity="error" size="small" variant="simple">
          <ul>
            <li v-for="(error, index) of $form.password.errors" :key="index">
              {{ error.message }}
            </li>
          </ul>
        </Message>
      </div>
      <Button type="submit" severity="secondary" label="Submit" />
    </Form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import { InputText, Message, Password, Button } from 'primevue'
import { Form } from '@primevue/forms'
import { useAuth } from '@/composables/useAuth'
import router from '@/router'

const initialValues = ref({
  username: '',
  password: '',
})

const resolver = zodResolver(
  z.object({
    username: z.string().min(1, { message: 'Username is required.' }),
    password: z.string().min(1, { message: 'Password is required.' }),
  }),
)

const { login } = useAuth()

const onFormSubmit = async (e) => {
  if (!e.valid) {
    return
  }

  const { username, password } = e.values
  await login(username, password)

  const redirect = router.currentRoute.value.query.redirect
  if (redirect) {
    router.push(redirect)
  } else {
    router.push({ name: 'home' })
  }
}
</script>
