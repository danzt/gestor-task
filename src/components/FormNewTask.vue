<script setup lang="ts">
import { reactive } from 'vue';
import { generateId } from 'src/helpers/generateId';

const emit = defineEmits(['save', 'close']);

const projectTask = reactive({
  id: generateId(),
  name: '',
  description: '',
  status: false
});

const handleSave = () => {
  emit('save', projectTask);
};

const handleClose = () => {
  emit('close', true);
};

</script>

<template>
  <q-card class="q-pa-md" flat>
    <q-card-section>
      <div class="row">
        <div class="col-12">
          <q-item>
            <q-input
              autogrow
              class="full-width custom-select"
              outlined
              label="Nombre de la tarea"
              v-model="projectTask.name"
            />
          </q-item>
        </div>
        <div class="col-12">
          <q-item>
            <q-input
              autogrow
              class="full-width custom-select"
              outlined
              label="Descripción de la tarea"
              v-model="projectTask.description"
            />
          </q-item>
        </div>
        <div class="col-12">
          <q-item>
            <q-select
              class="full-width custom-select"
              outlined
              label="Estado de la tarea"
              v-model="projectTask.status"
              :options="['Pendiente', 'En progreso', 'Completado']"
            />
          </q-item>
        </div>
      </div>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn
        @click="handleClose"
        rounded
        size="md"
        square
        class="text-capitalize bg-orange text-white"
      >Cerrar
      </q-btn
      >
      <q-btn
        @click="handleSave"
        rounded
        size="md"
        square
        class="text-capitalize bg-primary text-white"
      >Guardar
      </q-btn
      >
    </q-card-actions>
  </q-card>
</template>

<style scoped>

</style>
