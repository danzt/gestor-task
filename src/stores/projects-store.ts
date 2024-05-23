import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Project } from 'src/lib/types';
import { db } from 'src/boot/firebase';
import { collection, getDocs } from 'firebase/firestore/lite';

export const useProjectStore = defineStore('projects', () => {
  const projects = ref<Array<Project>>([]);

  const fetchProjects = async () => {
    const collRef = collection(db, 'projects');
    const querySnapshot = await getDocs(collRef);
    projects.value = querySnapshot.docs.map(doc => doc.data());
  };

  return {
    projects,
    fetchProjects
  };
});
