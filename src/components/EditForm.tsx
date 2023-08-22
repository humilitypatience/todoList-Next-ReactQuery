import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface SingleTodoComponentProps {
  id: number,
  title: string,
  description: string,
  isComplete: boolean,
  insertedat: string,
  tags: string[],
  handleDelete: (id: number) => void;
}

const EditForm = (props: SingleTodoComponentProps) => {

  const queryClient = useQueryClient();
  const queryKey = ["hydrate-todos"];

  const initialTagValues = (tags: any) => tags.reduce((obj: any, item: string, index: number) => {
    obj[`tag${index + 1}`] = item;
    return obj;
  }, {});   //The function that converts tags array into JSON object whose keys are 
  //tag1, tag2, ...

  const [inputValues, setInputValues] = useState({
    title: props.title,
    description: props.description,
    ...initialTagValues(props.tags)
  });

  useEffect(() => {
    setInputValues({
      title: props.title,
      description: props.description,
      ...initialTagValues(props.tags)
    })
  }, [props])

  const handleInputChange = (e: any) => {
    setInputValues({
      ...inputValues,
      [e.target.name]: e.target.value
    })
  }

  const [completedFlag, setCompletedFlag] = useState(props.isComplete);

  const addTag = (e: any) => {
    e.preventDefault();
    const tagCount = Object.keys(inputValues).length - 2;
    setInputValues((prevInputValues: any) => {
      const newTag = { [`tag${tagCount + 1}`]: "" };
      return { ...prevInputValues, ...newTag };
    });
  }

  const deleteTag = (e: any, index: number) => {
    e.preventDefault();

    setInputValues((prevInputValues: any) => {
      const { [`tag${index + 1}`]: deletedTagValue, ...rest } = prevInputValues;
      const { title, description, ...tags } = rest;
      const tagsArray: string[] = Object.values(tags);
      const newTags = tagsArray.reduce((obj: any, item: string, index: number) => {
        obj[`tag${index + 1}`] = item;
        return obj;
      }, {});
      return { title, description, ...newTags };
    });
  }

  const todoUpdate = (e: any, id: number) => {
    e.preventDefault();
    const todos: any = queryClient.getQueryData(queryKey);
    const { title, description, ...tags } = inputValues;
    console.log(todos)
    const newTodos = todos.map((item: any) => {
      if (item.id === id) {
        return {
          ...item,
          title,
          description,
          isComplete: completedFlag,
          tags: Object.values(tags)
        }
      }
      return item;
    })
    queryClient.setQueryData(queryKey, newTodos);
    // props.callback();
    // console.log(queryClient.getQueryData(queryKey));
  }

  const { title, description, ...tags } = inputValues;

  return (
    <div>
      <form id={`edit-form-${props.id}`}>
        <div>
          <label>Title</label>
          <input
            type="text"
            value={inputValues.title}
            name="title"
            onChange={(e) => handleInputChange(e)}
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            value={inputValues.description}
            name="description"
            onChange={(e) => handleInputChange(e)}
          />
        </div>
        <div>
          <label>Completed</label>
          <input
            type="checkbox"
            checked={completedFlag}
            onChange={() => setCompletedFlag(prevFlag => !prevFlag)} />
        </div>
        <div>
          <span>Tags</span>
          <button onClick={(e) => addTag(e)}>+</button>
          {
            Object.values(tags).map((item, index) => (
              <div key={index}>
                <input
                  type="text"
                  name={`tag${index + 1}`}
                  value={inputValues[`tag${index + 1}`]}
                  onChange={(e) => handleInputChange(e)}
                />
                <button onClick={(e) => deleteTag(e, index)}>-</button>
              </div>
            ))}
        </div>
        <button
          className="border-2 border-red-800 bg-slate-50"
          onClick={(e) => todoUpdate(e, props.id)}
        >
          save
        </button>
      </form>
    </div>
  )
}

export default EditForm;