
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast, Toaster } from "sonner";
import Loading from "./components/ui/Loading";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store/store";
import { addTask, closeDeleteModal, deleteTask, getTasks } from "./store/items.slice";
import TaskList from "./components/TaskList";
import AddTaskForm from "./components/AddTaskForm";

export const formSchema = z.object({
  title: z.string().min(2, {
    message: "Task Name must be at least 2 characters.",
  }),
});

function App() {

  const dispatch = useDispatch<AppDispatch>();
  const { tasks, status, error, openModalDelete, selectedDeleteId } = useSelector((state: RootState) => state.tasks);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const tasksLocal = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks') as string) : [];

  useEffect(() => {

    if (tasksLocal.length < 1 && tasks.length > 0) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    if (tasksLocal.length < 1) {
      dispatch(getTasks());
    }
  }, [dispatch, tasks]);



  function onSubmit(values: z.infer<typeof formSchema>) {
    // console.log("addtaskform", values)
    const createRandomId = Number(Math.random());
    dispatch(
      addTask({
        id: createRandomId,
        title: values.title,
        completed: false,
        userId: createRandomId
      })
    );

    if (status === "failed") {
      toast.error(error);
      return;
    } else if (status === "succeeded") {
      toast.success("Task added successfully!");
    }

    form.reset({
      title: "",
    });

  }


  function handleDelete(taskId: number) {
    // console.log(taskId);

    dispatch(deleteTask(taskId as number));

    if (status === "failed") {
      toast.error(error);
      return;
    } else if (status === "succeeded") {
      toast.success("Task Deleted successfully!");
    }

  }

  const handleCloseModal = () => {
    dispatch(closeDeleteModal());
  };

  // console.log("editTask", editTask);
  // console.log("editedTask", editedTask);
  // console.log("selectedDeleteId", selectedDeleteId);
  // console.log("tasks", tasks)
  // console.log("tasksLocal", tasksLocal)

  return (
    <>
      <Toaster position="top-center" richColors closeButton />
      {status === "loading" ? (
        <Loading />
      ) : (
        <>
          <div className="mt-20 flex flex-col gap-5 items-center justify-center w-screen">

            <AddTaskForm form={form} onSubmit={onSubmit} />
            <div className="p-5 w-full flex items-center justify-center">
              <TaskList
                tasksLocal={tasksLocal}
                dispatch={dispatch}
                status={status}
                error={error}
              />
            </div>
          </div>

          {openModalDelete && (
            <AlertDialog
              open={openModalDelete}
              onOpenChange={handleCloseModal}
            >

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undo. This will proceed to Delete
                    Task.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={handleCloseModal}>Cancel</AlertDialogCancel>
                  {selectedDeleteId && (
                    <AlertDialogAction
                      onClick={() => {
                        if (selectedDeleteId) {
                          handleDelete(selectedDeleteId);
                          // dispatch(closeDeleteModal());
                          handleCloseModal();
                        }
                      }}
                    >
                      Continue
                    </AlertDialogAction>
                  )}
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </>
      )}
    </>
  );
}

export default App;
