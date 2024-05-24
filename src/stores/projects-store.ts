import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Project } from 'src/lib/types';
import { db } from 'src/boot/firebase';
import { collection, deleteDoc, setDoc, doc,  getDocs,updateDoc } from 'firebase/firestore/lite';


export const useProjectStore = defineStore('projects', () => {
  const projects = ref<Array<Project>>([]);

  const fetchProjects = async () => {
    const collRef = collection(db, 'projects');
    const querySnapshot = await getDocs(collRef);
    projects.value = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        status: data.status
      } as Project;
    });
  };

  const upsertProject = async (project: Project) => {
    const collRef = collection(db, 'projects');
    await setDoc(doc(collRef, project.id), project);
    return fetchProjects();
  };

  const removeProject = async (id: string) => {
    const collRef = collection(db, 'projects');
    await deleteDoc(doc(collRef, id));
    return fetchProjects();
  };

  return {
    projects,
    fetchProjects,
    upsertProject,
    removeProject
  };
});
