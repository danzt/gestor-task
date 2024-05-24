<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Notify } from 'quasar';
import ModalCreate from 'components/ModalCreate.vue';
import FormNewProject from 'components/FormNewProject.vue';
import { useProjectStore } from 'stores/projects-store';
import { columns } from 'src/helpers/columnsProjects';
import { Project } from 'src/lib/types';
import { storeToRefs } from 'pinia';

const router = useRouter();

const projectsStore = useProjectStore();
const {projects} = storeToRefs(projectsStore);
const projectToEdit = ref<Project | null>(null);

// const projects = ref([]);
const initialPagination = {
  rowsPerPage: 10
};
const showDialog = ref(false);
const filter = ref('');

const handleCloseModal = () => {
  projectToEdit.value = null;
  showDialog.value = false;
};

const handleToggleModal = () => {
  showDialog.value = !showDialog.value;
};

const handleSaveProject = async (project: Project) => {
  await projectsStore.upsertProject(project);
  showDialog.value = false;
  await projectsStore.fetchProjects();
  Notify.create({
    type: 'positive',
    message: `${project.name}`
  });
};
const handleProjectClick = (project: Project) => {
  router.push({ name: 'ProjectTasks', params: { id: project.id } });
};

const deleteRow = async(row: Project) => {
  console.log('deleteRow', row);
  $q.dialog({
    title: 'Confirmar',
    message: '¿Está seguro que desea eliminar este proyecto?',
    ok: 'Eliminar',
    cancel: 'Cancelar',
    persistent: true
  }).onOk(async () => {
    await projectsStore.removeProject(row.id);
    $q.notify({
      type: 'positive',
      message: 'Proyecto eliminado con éxito'
    });
  });
};


const editRow = (row: Project) => {
  projectToEdit.value = row;
  showDialog.value = true;
};

onMounted(async () => {
  await projectsStore.fetchProjects();
});

</script>

<template>
  <q-page>
    <div class="q-pa-md">
      <q-table
        :columns="columns"
        :pagination="initialPagination"
        :rows="projects"
        bordered
        flat
        row-key="index"
        title="Users"
        :filter="filter"
      >
        <template v-slot:top>
          <q-btn
            class="q-ml-sm"
            color="green"
            icon="add"
            outline
            @click="handleToggleModal"
          >
            Crear Proyecto
          </q-btn>
          <q-space />
          <q-input
            v-model="filter"
            borderless
            color="primary"
            debounce="300"
            dense
            placeholder="Search"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              color="green"
              icon="visibility"
              size="md"
              @click="handleProjectClick(props.row)"
            />
            <q-btn
              class="q-ml-sm"
              color="primary"
              icon="edit"
              size="md"
              @click="editRow(props.row)"
            />
            <q-btn
              class="q-ml-sm"
              color="negative"
              icon="delete"
              size="md"
              @click="deleteRow(props.row)"
            />
          </q-td>
        </template>
      </q-table>
    </div>
    <ModalCreate
      v-model:show="showDialog"
      title= "Proyecto"
    >
      <FormNewProject
        :projectUpdate="projectToEdit"
        @save="handleSaveProject"
        @close="handleCloseModal" />
    </ModalCreate>
  </q-page>
</template>

<style scoped>

</style>
