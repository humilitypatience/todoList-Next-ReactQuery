import { useQueryClient } from "@tanstack/react-query";

interface SingleTodoComponentProps {
  id: number,
  title: string,
  description: string,
  isCompleted: boolean,
  insertedat: string,
  tags: string[]
}

const SingleTodo = (props: SingleTodoComponentProps) => {
  const queryClient = useQueryClient();
  const queryKey = ["hydrate-todos"];

  const deleteTodo = (selectedId: number) => {
    const todos: any = queryClient.getQueryData(queryKey);
    const updatedTodos = todos.filter((item: any) => {
      return item.id !== selectedId;
    })
    queryClient.setQueryData(queryKey, updatedTodos);
  }

  const { id, title, description, isCompleted, insertedat, tags } = props;
  return (
    <div>
      <div>{title}</div>
      <div>{description}</div>
      <div>{isCompleted ? "true" : "false"}</div>
      <div>{insertedat}</div>
      <ul>
        {tags.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <button className=" border-2 border-red-800 bg-slate-50">update</button>
      <button className="border-2 border-red-800 bg-slate-50" onClick={() => deleteTodo(id)}>Delete</button>
    </div>
  )
}

export default SingleTodo