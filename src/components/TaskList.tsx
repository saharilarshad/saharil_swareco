import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {  openDeleteModal, Task, updateTask } from "@/store/items.slice";
import { toast } from "sonner";
import { AppDispatch } from "@/store/store";
import TaskItem from "./TaskItem";


type TProps = {
  tasksLocal: Task[]
  dispatch: AppDispatch
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  // setOpenModalDelete: React.Dispatch<React.SetStateAction<boolean>>;
  // setSelectedDeleteId: React.Dispatch<React.SetStateAction<number | null>>;
}

const TaskList = ({ tasksLocal, dispatch, status, error }: TProps) => {



  function handleUpdate(taskId: number, isCompleted: boolean) {
    // console.log("status", isCompleted)

    dispatch(
      updateTask({
        id: taskId as number,
        completed: isCompleted,
      })
    );

    if (status === "failed") {
      toast.error(error);
      return;
    } else if (status === "succeeded") {
      toast.success("Task Edited successfully!");
    }


  }

  const handleDelete = (taskId: number) => {
    dispatch(openDeleteModal(taskId));
  };
  

  return (
    <>
      <Table className="">
        <TableCaption>A List Your Data.</TableCaption>
        <TableHeader className="w-full text-center">
          <TableRow className="text-center">
            <TableHead className="w-[40px]">No.</TableHead>
            <TableHead className="text-center">Title</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="w-full">
          {tasksLocal &&
            tasksLocal.map((task: Task, index: number) => (
              <TaskItem
                key={task.id}
                task={task}
                index={index}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
        </TableBody>
      </Table>

      
    </>
  )
}

export default TaskList