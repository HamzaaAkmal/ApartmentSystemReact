"use client";

import { useState, useCallback, useEffect } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  onSnapshot,
  query,
  orderBy,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { firestore } from "../firebase"; 
import type { Task, TaskStatus, TaskPriority } from "../types";

// Firestore collection name
const TASKS_COLLECTION = 'tasks';

// Reminder: Manual Data Seeding
// If you have existing mock task data, you will need to manually seed this 
// data into your Firestore 'tasks' collection to see it in the application.
// Alternatively, you can create new tasks via the UI once integrated.

// Helper to convert Firestore doc data to Task type, handling Timestamps
const fromFirestore = (snapshot: QueryDocumentSnapshot<DocumentData>): Task => {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    title: data.title,
    description: data.description,
    status: data.status as TaskStatus,
    priority: data.priority as TaskPriority,
    dueDate: data.dueDate instanceof Timestamp ? data.dueDate.toDate() : undefined,
    assignedTo: data.assignedTo,
    leadId: data.leadId,
    clientId: data.clientId,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : undefined,
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : undefined,
    completedAt: data.completedAt instanceof Timestamp ? data.completedAt.toDate() : undefined,
  } as Task;
};

interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  createTask: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completedAt'>) => Promise<Task | undefined>;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Real-time listener for task data
  useEffect(() => {
    setLoading(true);
    // Order by due date for more practical task management, then by creation for tie-breaking
    const q = query(collection(firestore, TASKS_COLLECTION), orderBy("dueDate", "asc"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasksList: Task[] = [];
      querySnapshot.forEach((docSnap) => {
        tasksList.push(fromFirestore(docSnap));
      });
      setTasks(tasksList);
      setLoading(false);
      setError(null);
    }, (err) => {
      console.error("Error fetching tasks with onSnapshot: ", err);
      setError(`Failed to subscribe to task updates: ${err.message}`);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  // Create operation
  const createTask = useCallback(async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completedAt'>): Promise<Task | undefined> => {
    setLoading(true); 
    setError(null);
    try {
      const newTaskDataFirebase: any = {
        ...taskData,
        status: taskData.status || "pending", // Default status
        priority: taskData.priority || "medium", // Default priority
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        completedAt: null, // Explicitly null on creation
      };
      
      if (taskData.dueDate && taskData.dueDate instanceof Date) {
        newTaskDataFirebase.dueDate = Timestamp.fromDate(taskData.dueDate);
      } else if (taskData.dueDate === undefined) {
        newTaskDataFirebase.dueDate = null; // Store as null if not provided
      }

      const docRef = await addDoc(collection(firestore, TASKS_COLLECTION), newTaskDataFirebase);
      setLoading(false);
      return { 
        ...taskData, 
        id: docRef.id,
        status: newTaskDataFirebase.status,
        priority: newTaskDataFirebase.priority,
        createdAt: (newTaskDataFirebase.createdAt as Timestamp).toDate(), 
        updatedAt: (newTaskDataFirebase.updatedAt as Timestamp).toDate(),
        dueDate: taskData.dueDate ? new Date(taskData.dueDate) : undefined,
        completedAt: undefined, // completedAt is undefined initially
      };
    } catch (err: any) {
      console.error("Error creating task: ", err);
      setError(`Failed to create task: ${err.message}`);
      setLoading(false);
      throw err;
    }
  }, []);

  // Update operation
  const updateTask = useCallback(async (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    setLoading(true);
    setError(null);
    try {
      const docRef = doc(firestore, TASKS_COLLECTION, id);
      const updatesFirebase: {[key:string]: any} = { ...updates };

      updatesFirebase.updatedAt = Timestamp.now();

      // Handle dueDate conversion
      if (updates.dueDate && updates.dueDate instanceof Date) {
        updatesFirebase.dueDate = Timestamp.fromDate(updates.dueDate);
      } else if (updates.hasOwnProperty('dueDate') && (updates.dueDate === undefined || updates.dueDate === null)) {
        updatesFirebase.dueDate = null;
      }

      // Handle completedAt based on status
      if (updates.status === "completed") {
        updatesFirebase.completedAt = Timestamp.now();
      } else if (updates.hasOwnProperty('status') && updates.status !== "completed") {
        // If status is changed from completed to something else, set completedAt to null
        updatesFirebase.completedAt = null;
      }
      
      await updateDoc(docRef, updatesFirebase);
      setLoading(false);
    } catch (err: any) {
      console.error("Error updating task: ", err);
      setError(`Failed to update task: ${err.message}`);
      setLoading(false);
      throw err;
    }
  }, []);

  // Delete operation
  const deleteTask = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const docRef = doc(firestore, TASKS_COLLECTION, id);
      await deleteDoc(docRef);
      setLoading(false);
    } catch (err: any) {
      console.error("Error deleting task: ", err);
      setError(`Failed to delete task: ${err.message}`);
      setLoading(false);
      throw err;
    }
  }, []);

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
  };
}
