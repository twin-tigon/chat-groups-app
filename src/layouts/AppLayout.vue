<template>
  <div class="app-layout">
    <header class="header">
      <Menubar :model="menuItems" />
    </header>

    <div class="content">
      <aside class="sidebar">
        <ChannelList />
      </aside>

      <main class="main-content">
        <Panel>
          <template #header><slot name="header" /></template>
          <slot />
        </Panel>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Menubar, Panel } from 'primevue'
import { useRouter } from 'vue-router'
import ChannelList from '@/components/ChannelList.vue'
import { useAuth } from '@/composables/useAuth'

const { logout } = useAuth()
const router = useRouter()

const menuItems = ref([
  {
    label: 'Logout',
    command: () => {
      logout()
      router.push({ name: 'login' })
    },
  },
])
</script>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.header {
  padding-bottom: 1rem;
}

.content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar {
  width: 250px;
  border-right: 1px solid #ddd;
  padding-right: 1rem;
}

.main-content {
  flex: 1;
  padding-left: 1rem;
  overflow-y: auto;
}
</style>
