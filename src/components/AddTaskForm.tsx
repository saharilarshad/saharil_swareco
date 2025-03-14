import { formSchema } from "@/App";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

interface AddTaskFormProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
}

const AddTaskForm = ({form, onSubmit}:AddTaskFormProps) => {
  return (
    <>
    <h2 className="text-2xl font-semibold">Add Your Task Here!</h2>

<Form {...form}>
  <form
    onSubmit={form.handleSubmit(onSubmit)}
    className="space-y-4 w-4/5 md:w-1/3"
  >
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Task Name</FormLabel>
          <FormControl>
            <Input placeholder="Your New Task" {...field} />
          </FormControl>
          <FormDescription>
            This is your display task name.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />

    <div className="flex items-center justify-center w-full">
      <Button className="w-1/2" type="submit">
        Submit
      </Button>
    </div>
  </form>
</Form>
    </>
  )
}

export default AddTaskForm