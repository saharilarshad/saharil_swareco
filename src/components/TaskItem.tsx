import { Task } from '@/store/items.slice';
import { TableCell, TableRow } from "@/components/ui/table";
import { Input } from './ui/input';
import { Trash2 } from 'lucide-react';

type TaskItemProps = {
  task: Task;
  index: number;
  onUpdate: (taskId: number, isCompleted: boolean) => void;
  onDelete: (taskId: number) => void;
};

const TaskItem = ({ task, index, onUpdate, onDelete }: TaskItemProps) => {

  function handleUpdate() {
    onUpdate(task.id, !task.completed);
  }

  function handleDelete() {
    onDelete(task.id);
  }

  return (
    <TableRow className="w-full">
      <TableCell className="font-medium w-[40px]">{index + 1}</TableCell>
      <TableCell className={`text-center ${task.completed && 'line-through'}`}>{task.title}</TableCell>
      <TableCell className="flex items-center justify-center">
        <Input
          type="checkbox"
          checked={task.completed}
          className="h-6 w-6"
          onChange={handleUpdate}
        />
      </TableCell>
      <TableCell className="text-center">
        <div className="flex items-center justify-center gap-3">
          <span onClick={handleDelete}>
            <Trash2 className="cursor-pointer text-red-500" />
          </span>
        </div>
      </TableCell>
    </TableRow>
  )
}

export default TaskItem