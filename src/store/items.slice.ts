import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface Task {
  id: number,
  title: string;
  completed: boolean;
  userId: number
}

interface TasksState {
  tasks: Task[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  openModalDelete: boolean,
  selectedDeleteId: number | null,
}

const initialState: TasksState = {
  tasks: [],
  status: "idle",
  error: null,
  openModalDelete: false,
  selectedDeleteId: null,
};

export const getTasks = createAsyncThunk(
  "tasks",
  async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}`);
    return res.data;
  }
);

export const addTask = createAsyncThunk(
  "tasks/addTask",
  async (task: { id: number, title: string, completed: boolean, userId: number }) => {
    const currentTasks = JSON.parse(localStorage.getItem('tasks') as string);
    // console.log("currentTasks", currentTasks);
    // console.log("state.tasks", state.tasks);

    const updatedTasks = currentTasks && [...currentTasks, task];

    await new Promise((resolve) => setTimeout(resolve, 1000));

    localStorage.setItem("tasks", JSON.stringify(updatedTasks));

    return task;
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async (editTask: {id: number, completed: boolean}) => {
    const currentTasks = JSON.parse(localStorage.getItem('tasks') as string);

    const updatedTasks = currentTasks && currentTasks.map((task:Task) => {
      if (task.id === editTask.id) {
        return { ...task, completed: editTask.completed };
      }
      return task;
    });

    localStorage.setItem("tasks", JSON.stringify(updatedTasks));

    return updatedTasks;
  }
);


export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id: number) => {
    const currentTasks = JSON.parse(localStorage.getItem('tasks') as string);

    const updatedTasks = currentTasks.filter((task:Task) => task.id !== id);

    localStorage.setItem("tasks", JSON.stringify(updatedTasks));

    return id;
  }
);


const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    openDeleteModal: (state, action: PayloadAction<number>) => {
      state.openModalDelete = true;
      state.selectedDeleteId = action.payload;
    },
    closeDeleteModal: (state) => {
      state.openModalDelete = false;
      state.selectedDeleteId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTasks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.status = "succeeded";
        state.tasks = action.payload;
      })
      .addCase(getTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to get tasks";
      })

      .addCase(addTask.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.status = "succeeded";
        state.tasks.push(action.payload);
      })
      .addCase(addTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to add task";
      })

      .addCase(updateTask.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.status = "succeeded";
        state.tasks = action.payload;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to update item";
      })

      .addCase(deleteTask.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<number>) => {
        state.status = "succeeded";
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to delete item";
      })

  },
});

export const { openDeleteModal, closeDeleteModal } = tasksSlice.actions;

export default tasksSlice.reducer;
