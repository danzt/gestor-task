<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import BoardTask from 'components/BoardTask.vue';

const route = useRoute();
const projectId = ref(route.params.id);

onMounted(async () => {
  console.log('tasks');
});

</script>

<template>
<q-page class="q-pa-md">
  <div class="row justify-center">
   <BoardTask :projectId="projectId"  />
  </div>
</q-page>
</template>

<style scoped>

</style>
