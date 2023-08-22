

import EditForm from "./EditForm";

interface SingleTodoComponentProps {
  id: number,
  title: string,
  description: string,
  isComplete: boolean,
  insertedat: string,
  tags: string[],
  handleDelete: (id: number) => void
}

const SingleTodo = (props: SingleTodoComponentProps) => {
  const { id, title, description, isComplete, insertedat, tags } = props;
  return (
    <div>
      <div>{id}</div>
      <div>{title}</div>
      <div>{description}</div>
      <div>{isComplete ? "true" : "false"}</div>
      <div>{insertedat}</div>
      <ul>
        {tags.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <button className=" border-2 border-red-800 bg-slate-50">update</button>
      <button className="border-2 border-red-800 bg-slate-50" onClick={() => {
        props.handleDelete(id);
        // props.callback();
      }}>Delete</button>
      <EditForm {...props } />
    </div>
  )
}

export default SingleTodo