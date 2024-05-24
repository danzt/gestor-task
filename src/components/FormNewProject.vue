<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { Project } from 'src/lib/types';
import { generateId } from 'src/helpers/generateId';

interface Props {
  projectUpdate?: Project;
}

const props = defineProps<Props>();

const projectForm = reactive<Project>({
  id: generateId(),
  name: '',
  description: '',
  status: false
});

// const emit = defineEmits(['save', 'close']);
const emit = defineEmits<{
  (e: 'save', project: Project): void;
  (e: 'close', value: boolean): void;
}>()

const handleSave = () => {
  if (projectForm) {
    emit('save', projectForm);
  }
};

const handleClose = () => {
  emit('close', true);
};

onMounted(() => {
  if (props.projectUpdate) {
    const { id, name, description, status } = props.projectUpdate;
    projectForm.id = id;
    projectForm.name = name;
    projectForm.description = description;
    projectForm.status = status;
  }
});
</script>

<template>
  <q-card class="my-card no-shadow	">
    <q-separator dark inset />
    <q-card-section>
      <div class="row">
        <div class="col-12">
          <q-item>
            <q-input
              autogrow
              class="full-width custom-select"
              outlined
              label="Nombre del Proyecto"
              v-model="projectForm.name"
            />
          </q-item>
        </div>
        <div class="col-12">
          <q-item>
            <q-input
              autogrow
              class="full-width custom-select"
              outlined
              label="Descripción del Proyecto"
              v-model="projectForm.description"
            />
          </q-item>
        </div>
        <div class="col-12">
          <q-item>
            <q-toggle
              class="full-width custom-select"
              outlined
              label="Estado del Proyecto"
              v-model="projectForm.status"
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
