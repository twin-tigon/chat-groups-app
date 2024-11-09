<template>
  <ul>
    <li v-for="channel in channels" :key="channel.id">
      <RouterLink :to="`/channels/${channel.id}`">{{ channel.name }}</RouterLink>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getChannels } from '@/api/channels'
import { RouterLink } from 'vue-router'

const channels = ref([])

onMounted(async () => {
  channels.value = await getChannels()
})
</script>
