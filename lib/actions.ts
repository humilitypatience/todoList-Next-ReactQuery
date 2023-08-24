import { supabaseClient } from "./client";

export const getTodos = async () => {
  const data = await supabaseClient
    .from("todos")
    .select("*")
    .order("id", { ascending: true })
    .then(({ data, error }) => {
      if (!error) {
        return data
      }
    });

  return data;
};

export const deleteFromSupa = async (todoId: number) => {
  const { error } = await supabaseClient
                    .from('todos')
                    .delete()
                    .eq('id', todoId);
  if(error) {
    throw new Error(error.message);
  }
  return "Successfully deleted";
};

export const updateTodoFromSupa = async (updatedTodo: any) => {
  const { error } = await supabaseClient
                    .from('todos')
                    .update(updatedTodo)
                    .eq('id', updatedTodo.id);
  if(error) {
    throw new Error(error.message);
  }

  return "Successfully updated";
};

export const insertTodoToSupa = async (newTodo: any) => {
  const { error } = await supabaseClient
                    .from('todos')
                    .insert([newTodo]);

  if(error) {
    throw new Error(error.message);
  }

  return "Successfully inserted";
}