<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useQuasar } from 'quasar';
import { columns } from 'src/helpers/columnsTask';
import ModalCreate from 'components/ModalCreate.vue';
import FormNewTask from 'components/FormNewTask.vue';
import { Task } from 'src/lib/types';
import { useTaskStore } from 'stores/task-store';
import { storeToRefs } from 'pinia';

const props = defineProps({
  projectId: {
    type: String,
    required: true
  }
});

const $q = useQuasar();
const taskStore = useTaskStore();
const { tasks } = storeToRefs(taskStore);
const filter = ref('');
const selected = ref([]);


const taskBeingEdited = reactive<Task>({
  id: '',
  name: '',
  description: '',
  status: ''
});
const showDialog = ref(false);

const startEditingTask = (task: Task) => {
  taskBeingEdited.id = task.id;
  taskBeingEdited.name = task.name;
  taskBeingEdited.description = task.description;
  taskBeingEdited.status = task.status;
};

const states = ['Pendiente', 'En progreso', 'Completado'];

const saveEditedTask = async () => {
  await taskStore.upsertTask(taskBeingEdited, props.projectId);
  closeEditingTask();
};
const closeEditingTask = () => {
  taskBeingEdited.id = '';
  taskBeingEdited.name = '';
  taskBeingEdited.description = '';
  taskBeingEdited.status = '';
};

const getClassByStatus = (status: string) => {
  if (status === 'Pendiente') {
    return 'bg-orange';
  }
  if (status === 'En progreso') {
    return 'bg-blue';
  }
  if (status === 'Completado') {
    return 'bg-green';
  }
};

const deleteTask = async (taskId: string) => {
  $q.dialog({
    title: 'Confirmar',
    message: '¿Está seguro que desea eliminar esta tarea?',
    ok: 'Eliminar',
    cancel: 'Cancelar',
    persistent: true
  }).onOk(async () => {
    await taskStore.removeTask(taskId, props.projectId);
    $q.notify({
      type: 'positive',
      message: 'Tarea eliminada con éxito'
    });
  });
};
const handleToggleModal = () => {
  showDialog.value = !showDialog.value;
};
const handleSaveTask = async (task: Task) => {
  await taskStore.upsertTask(task, props.projectId);
  showDialog.value = false;
};

const countTasksByStatus = computed(() => {
  return tasks.value.reduce((acc, task) => {
    if (task.status) {
      acc[task.status] = acc[task.status] ? acc[task.status] + 1 : 1;
    }
    return acc;
  }, {} as Record<string, number>);
});

onMounted(async () => {
  await taskStore.fetchTasks(props.projectId);
});
</script>


<template>
  <div>

    <q-btn
      class="q-ma-md"
      color="primary"
      icon="arrow_back"
      @click="$router.go(-1)"
    >
      Gestionar proyectos
    </q-btn>
  </div>
  <div class="q-pa-md" style="width: 60%">
    <div class="q-pa-md q-gutter-md row items-center justify-center">
      <q-btn color="orange" size="sm" label="Pendiente">
        <q-badge color="grey-10" floating transparent>
          {{ countTasksByStatus['Pendiente'] ?? 0 }}
        </q-badge>
      </q-btn>
      <q-btn color="blue" size="sm" label="En progreso">
        <q-badge color="grey-10" floating transparent>
          {{ countTasksByStatus['En progreso'] ?? 0 }}
        </q-badge>
      </q-btn>
      <q-btn color="green" size="sm" label="Completado">
        <q-badge color="grey-10" floating transparent>
          {{ countTasksByStatus['Completado'] ?? 0 }}
        </q-badge>
      </q-btn>
    </div>
    <q-table
      class="q-pa-md q-gutter-lg"
      title="Tareas"
      :rows="tasks"
      :columns="columns"
      row-key="name"
      selection="multiple"
      v-model:selected="selected"
      :filter="filter"
      grid
      hide-header
      :rows-per-page-options="[1000]"
    >
      <template v-slot:top-right>
        <q-btn
          class="q-mr-md"
          color="green"
          icon="add"
          outline
          @click="handleToggleModal"
        >
          Nueva Tarea
        </q-btn>
        <q-space />
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Buscar">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:item="props">
        <div
          class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-4 grid-style-transition q-mt-md"
          :style="props.selected ? 'transform: scale(0.95);' : ''"
        >
          <q-card bordered flat :class="props.selected ? ($q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2') : ''">
            <q-card-section :class="getClassByStatus(props.row.status)">
              {{ props.row.name }}
            </q-card-section>
            <q-separator />
            <q-list dense>
              <q-item v-for="col in props.cols.filter(col => col.name !== 'desc')" :key="col.name">
                <q-item-section>
                  <q-item-label>{{ col.label }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label class="truncate" caption v-if="taskBeingEdited.id !== props.row.id">{{ props.row[col.name] }}
                  </q-item-label>
                  <div v-else>
                    <q-input v-model="taskBeingEdited[col.name]" v-if="col.name !== 'status'" />
                    <q-select v-model="taskBeingEdited.status" v-else :options="states" />
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
            <q-card-section v-if="taskBeingEdited.id !== props.row.id">
              <q-btn color="primary" icon="edit" @click="startEditingTask(props.row)"
                     class="q-mr-sm" size="sm" />
              <q-btn color="negative" icon="delete" @click="deleteTask(props.row.id)" size="sm" />
            </q-card-section>
            <q-card-section v-else>
              <q-btn color="warning" icon="close" @click="closeEditingTask()" class="q-mr-sm" size="sm" />
              <q-btn color="primary" icon="save" @click="saveEditedTask()" size="sm" />
            </q-card-section>
          </q-card>
        </div>
      </template>
    </q-table>
    <ModalCreate
      v-model:show="showDialog"
      title="Nueva Tarea">
      <FormNewTask
        :taskUpdate="taskBeingEdited"
        @save="handleSaveTask"
        @close="handleToggleModal" />
    </ModalCreate>
  </div>
</template>

<style lang="sass">
.grid-style-transition
  transition: transform .28s, background-color .28s

.truncate
  overflow: hidden
  text-overflow: ellipsis
  white-space: nowrap
</style>
