"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabaseClient } from "../../lib/client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import SingleTodo from "./SingleTodo";
import EditForm from "./EditForm";

interface OrganicTodoProps {
  id: number | undefined,
  title: string,
  description: string,
  isComplete: boolean,
  insertedat: any,
  tags: string[]
}

async function getTodos() {
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
}

export default function ShowList() {
  const { data, isLoading } = useQuery({
    queryKey: ["hydrate-todos"],
    queryFn: getTodos,
    refetchOnWindowFocus: false
  });

  const queryClient = useQueryClient();
  const queryKey = ["hydrate-todos"];

  const [showAddTodoFormFlag, setShowAddTodoFormFlag] = useState(false);

  const [allTodosSelectedFlag, setAllTodosSelectedFlag] = useState(false);

  const [additionalFlag, setAdditionalFlag] = useState(false);

  const [selectedFlagArray, setSelectedFlagArray] = useState(() => {
    const dataLength: any = data?.length;
    let initialArray: boolean[] = [];
    for (let i = 0; i < dataLength; i++) {
      initialArray[i] = false;
    }
    return initialArray;
  });

  useEffect(() => {
    setSelectedFlagArray(() => {
      const dataLength: any = data?.length;
      let initialArray: boolean[] = [];
      for (let i = 0; i < dataLength; i++) {
        initialArray[i] = false;
      }
      return initialArray;
    })
  }, [data]);

  const handleAdd = (e: any, newTodo: any, isComplete: boolean) => {
    // e.preventDefault();
    const todos: OrganicTodoProps[] | undefined = queryClient.getQueryData(queryKey);

    const { title, description, tags } = newTodo;

    const organicTodo: OrganicTodoProps = { title, description, id: -1, isComplete: false, tags: [], insertedat: "" }

    organicTodo.isComplete = isComplete;

    const date = new Date();

    organicTodo.insertedat = date.toLocaleDateString();

    organicTodo.id = todos?.length ? todos?.length + 1 : -1;

    organicTodo.tags = tags;

    const updatedTodos: any[] | undefined = todos ? [...todos, organicTodo] : [organicTodo]

    queryClient.setQueryData(queryKey, [...updatedTodos]);

    setShowAddTodoFormFlag(false);
  }

  const handleClose = (e: any) => {
    e.preventDefault();

    setShowAddTodoFormFlag(false)
  }

  const handleSelect = (index: number) => {
    setSelectedFlagArray((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = !updatedArray[index];
      return updatedArray;
    })
  }

  const selectAll = () => {
    let allFlag: boolean = true;
    setAllTodosSelectedFlag(prev => {
      allFlag = !prev;
      return !prev;
    });
    setSelectedFlagArray((prev) => {
      const length: any = data?.length;
      let updatedArray: boolean[] = [];
      for (let i = 0; i < length; i++) {
        updatedArray[i] = allFlag;
      }
      return updatedArray;
    });
  }

  const handleRemove = () => {
    const todos: any = queryClient.getQueryData(queryKey);
    let updatedTodos = [...todos];
    const todosCount = updatedTodos.length;
    let splicedCount = 0;
    for (let i = 0; i < todosCount; i++) {
      if (selectedFlagArray[i]) {
        updatedTodos.splice((i - splicedCount), 1);
        splicedCount++;
      }
    }
    queryClient.setQueryData(queryKey, updatedTodos);
  }

  const handleComplete = () => {
    const todos: any = queryClient.getQueryData(queryKey);
    let updatedTodos = [...todos];
    const todosCount = updatedTodos.length;
    for (let i = 0; i < todosCount; i++) {
      if(selectedFlagArray[i]) {
        updatedTodos[i].isComplete = true;
      }    
    }
    queryClient.setQueryData(queryKey, updatedTodos);
    setAdditionalFlag(prev => !prev)
  }
  

  const emptyTodo = {
    id: -1,
    title: "",
    description: "",
    isComplete: false,
    insertedat: "",
    tags: []
  }

  return (

    <div>
      <div className="w-full h-16 p-5 flex flex-row justify-between items-center bg-gray-200 opacity-80">
        <h1 className="text-lg font-bold">TodoApp</h1>
        <div className="flex flex-row gap-2">
          <button
            className="shadow-md px-2 rounded-md bg-slate-50"
            onClick={() => setShowAddTodoFormFlag(true)}
          >
            Add Todo
          </button>
          <button
            className="shadow-md px-2 rounded-md bg-slate-50"
            onClick={selectAll}
          >
            {allTodosSelectedFlag ? "Deselect All" : "Select All"}
          </button>
          <button
            className="shadow-md px-2 rounded-md bg-rose-200"
            onClick={handleRemove}
          >
            Remove
          </button>
          <button
            className="shadow-md px-2 rounded-md bg-green-200"
            onClick={handleComplete}
          >
            Complete
          </button>
        </div>
      </div>
      <div className="m-auto h-10 flex flex-row justify-center gap-4 items-center">
          <div className="flex flex-row items-center gap-1"><div className="w-4 h-4 rounded-full shadow-2xl bg-green-600"></div><span className="text-sm">Complete</span></div>
          <div className="flex flex-row items-center gap-1"><div className="w-4 h-4 rounded-full shadow-2xl bg-red-600"></div><span className="text-sm">Incomplete</span></div>
        </div>
      <div className="px-5 mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2 2xl:grid-cols-3">
        {data?.map((item: any, index: number) => (
          <SingleTodo
            {...item}
            key={index}
            selected={selectedFlagArray[index] !== undefined ? selectedFlagArray[index] : false}
            handleSelect={() => handleSelect(index)}
          />
        ))}
      </div>
      {showAddTodoFormFlag &&
        (<div className=" w-screen h-screen fixed top-0 left-0 bg-gray-800 opacity-95">
          <div className="relative w-80 m-auto mt-40">
            <EditForm {...emptyTodo} handleUpdate={handleAdd} handleClose={handleClose} />
          </div>
        </div>)
      }
    </div>
  )
}
