import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";

interface SingleTodoComponentProps {
  id: number,
  title: string,
  description: string,
  isComplete: boolean,
  insertedat: string,
  tags: string[],
  handleUpdate: (e: any, updatedTodo: any, inComplete: boolean) => void,
  handleClose: (e: any) => void
}

const validationSchema = z
  .object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().min(10, { message: "Description must be more than 10 characters" })
  });

type ValidationSchema = z.infer<typeof validationSchema>;

const EditForm = (props: SingleTodoComponentProps) => {

  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema)
  });

  const [inputValues, setInputValues] = useState({
    title: props.title,
    description: props.description,
    tags: props.tags
  });

  useEffect(() => {
    setInputValues({
      title: props.title,
      description: props.description,
      tags: props.tags
    })
  }, [props]);

  const handleInputChange = (e: any) => {
    setInputValues({
      ...inputValues,
      [e.target.name]: e.target.value
    })
  }

  const [completedFlag, setCompletedFlag] = useState(props.isComplete);

  const addTag = (e: any) => {
    e.preventDefault();

    setInputValues((prev: any) => {
      const updatedTags = [...prev.tags];
      updatedTags.push("");
      console.log(updatedTags)
      return { ...prev, tags: updatedTags };
    });
  }

  const deleteTag = (e: any, index: number) => {
    e.preventDefault();

    setInputValues((prev: any) => {
      const updatedTags = [...prev.tags];
      updatedTags.splice(index, 1);
      return { ...prev, tags: updatedTags };
    });
  }

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <form id={`edit-form-${props.id}`}
          onSubmit={handleSubmit((e) => props.handleUpdate(e, inputValues, completedFlag))}
          className="flex flex-col p-3 gap-2 bg-green-50 shadow-md rounded-lg"
        >
          <div className="relative">
            <button
              className="absolute top-[-10px] right-0"
              onClick={(e) => props.handleClose(e)}
            >
              X
            </button>
            <label
              className="text-slate-500"
            >Title
              <span className="text-red-500"> *</span>
            </label>
            <input
              type="text"
              value={inputValues.title}
              {...register("title")}
              onChange={(e) => handleInputChange(e)}
              className="block outline-none w-full border border-slate-900 rounded-md focus:border-blue-900 focus:border-2"
            />
            {errors.title && (
              <p className="text-xs italic text-red-500 mt-2"> {errors.title?.message}
              </p>
            )}
          </div>
          <div>
            <label
              className="text-slate-500"
            >Description
              <span className="text-red-500"> *</span>
            </label>
            <textarea
              value={inputValues.description}
              {...register("description")}
              onChange={(e) => handleInputChange(e)}
              className="block outline-none w-full border border-slate-900 rounded-md focus:border-blue-900 focus:border-2"
            />
            {errors.description && (
              <p className="text-xs italic text-red-500 mt-2"> {errors.description?.message}
              </p>
            )}
          </div>
          <div className=" flex flex-row items-center">
            <button
              className={`w-10 bg-gray-300 rounded-full p-1 ${completedFlag ? 'bg-green-500' : 'bg-gray-400'
                }`}
              onClick={
                (e) => {
                  e.preventDefault();
                  setCompletedFlag(prev => !prev);
                }
              }
            >
              <span
                className={`w-4 h-4 rounded-full block ${completedFlag ? 'translate-x-4' : 'translate-x-0'
                  } bg-white shadow transform transition-transform duration-300 ease-in-out`}
              ></span>
            </button>
            <span className=" text-center mx-2 text-slate-500">isComplete</span>
          </div>
          <div>
            <span className="text-slate-500 mr-5">Tags</span>
            <button
              onClick={(e) => addTag(e)}
              className=" w-8 h-8 bg-green-200 shadow-2xl rounded-2xl"
            >
              +
            </button>
            {
              inputValues.tags.map((item, index) => (
                <div className="flex flex-row gap-5 my-1" key={index}>
                  <input
                    type="text"
                    name={`tag${index}`}
                    value={inputValues.tags[index]}
                    onChange={(e) => {
                      const { name, value } = e.currentTarget;
                      const tagIndex = Number(name.slice(3));
                      setInputValues((prev: any) => {
                        let newTags = prev.tags;
                        newTags[tagIndex] = value;
                        return {
                          ...prev,
                          tags: newTags
                        }
                      })
                      handleInputChange(e)
                    }}
                    className="block pr-5 outline-none w-full border border-slate-900 rounded-md focus:border-blue-900 focus:border-2"
                  />
                  <button
                    onClick={(e) => deleteTag(e, index)}
                    className="w-8 h-8 bg-green-200 shadow-2xl rounded-full"
                  >
                    -
                  </button>
                </div>
              ))}
          </div>
          <div className="flex flex-row gap-4">
            <button
              className=" bg-green-500 shadow-lg px-2 rounded-sm"
              type="submit"
            >
              save
            </button>
            <button
              className=" bg-rose-100 shadow-lg px-2 rounded-sm"
              onClick={(e) => { props.handleClose(e) }}
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  )
}

export default EditForm;