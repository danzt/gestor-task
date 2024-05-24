import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Task } from 'src/lib/types';
import { db } from 'src/boot/firebase';
import { collection, deleteDoc, setDoc, doc,  getDocs } from 'firebase/firestore/lite';


export const useTaskStore = defineStore('tasks', () => {
  const tasks = ref<Array<Task>>([]);

  const fetchTasks = async (projectId: string) => {
    const projectRef = doc(db, 'projects', projectId);
    const tasksRef = collection(projectRef, 'tasks');
    const querySnapshot = await getDocs(tasksRef);
    tasks.value = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        description: data.description,
        status: data.status
      } as Task;
    });
  };

  const upsertTask = async (task: Task, projectId: string) => {
    const taskRef = doc(db, `projects/${projectId}/tasks/${task.id}`);
    await setDoc(taskRef, task);
    return fetchTasks(projectId);
  };

  const removeTask = async (taskId: string, projectId: string) => {
    const taskRef = doc(db, `projects/${projectId}/tasks/${taskId}`);
    await deleteDoc(taskRef);
    return fetchTasks(projectId);
  };

  return {
    tasks,
    fetchTasks,
    upsertTask,
    removeTask
  };
});
