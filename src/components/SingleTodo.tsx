import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import moment from "moment";
import { motion, AnimatePresence } from "framer-motion"

import EditForm from "./EditForm";

interface SingleTodoComponentProps {
  id: number,
  title: string,
  description: string,
  isComplete: boolean,
  insertedat: string,
  tags: string[],
  selected: boolean,
  handleSelect: () => void,
  handleUpdate: (e: any, updatedTodo: any, inComplete: boolean) => void
}

const SingleTodo = (props: SingleTodoComponentProps) => {
  const { id, title, description, isComplete, insertedat, tags } = props;
  const [showEditFormFlag, setShowEditFormFlag] = useState(false);

  const queryClient = useQueryClient();
  const queryKey = ["hydrate-todos"];

  const deleteTodo = (id: number) => {
    const todos: any = queryClient.getQueryData(queryKey);
    const updatedTodos = todos.filter((item: any) => item.id !== id);
    queryClient.setQueriesData(queryKey, updatedTodos);
    setShowEditFormFlag(false);
  }

  const handleUpdate = (e: any, updatedTodo: any, isComplete: boolean) => {

    const todos: any = queryClient.getQueryData(queryKey);
    const { title, description, tags } = updatedTodo;
    const newTodos = todos.map((item: any) => {
      if (item.id === id) {
        return {
          ...item,
          title,
          description,
          isComplete,
          tags
        }
      }
      return item;
    })
    queryClient.setQueryData(queryKey, newTodos);
    setShowEditFormFlag(false);
  }

  const handleClose = (e: any) => {
    e.preventDefault();

    setShowEditFormFlag(false);
  }

  return (
    <div className="flex flex-col gap-1">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="drop-shadow-md bg-white flex flex-col gap-3 p-3 rounded-lg">
          <div className="flex flex-row justify-between">
            <input
              className="w-4 h-4 opacity-100"
              type="checkbox"
              checked={props.selected}
              onChange={props.handleSelect}
            />
            <div className={`w-4 h-4 rounded-full shadow-2xl ${isComplete ? 'bg-green-600' : 'bg-red-600'}`}></div>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{title}
              <span>(</span>
              {tags.map((item, index, array) => (
                <span className="text-sm font-normal" key={index}>{item}{index !== array.length - 1 && ","}</span>
              ))}
              <span>)</span>
            </h2>
          </div>
          <div className=" rounded-lg">{description}</div>
          <div>{moment(insertedat).format('MMM Do YYYY')}</div>
          <div className="w-3/4 h-6 m-auto grid grid-cols-2 gap-10">
            <motion.button
              className=" bg-cyan-500 shadow-lg rounded-lg"
              onClick={() => setShowEditFormFlag(true)}
              initial={{ opacity: 0.6 }}
              whileHover={{
                scale: 1.2,
                transition: { duration: 0.1 }
              }}
              whileTap={{ scale: 0.9 }}
              whileInView={{ opacity: 1 }}
            >
              update
            </motion.button>
            <motion.button
              className="bg-rose-600 shadow-lg rounded-lg"
              onClick={() => deleteTodo(id)}
              initial={{ opacity: 0.6 }}
              whileHover={{
                scale: 1.2,
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.9 }}
              whileInView={{ opacity: 1 }}
            >
              Delete
            </motion.button>
          </div>
        </div>
      </motion.div>
      {
        showEditFormFlag && <EditForm {...props} handleUpdate={handleUpdate} handleClose={handleClose} />
      }
    </div>
  )
}

export default SingleTodo