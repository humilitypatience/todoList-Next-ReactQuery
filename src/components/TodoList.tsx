"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseClient } from "../../lib/client";
import { useQuery } from "@tanstack/react-query";
import SingleTodo from "./SingleTodo";
import { useEffect, useState } from "react";
import EditForm from "./EditForm";

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
  const queryClient = useQueryClient();
  const queryKey = ["hydrate-todos"];
  const [flag, setFlag] = useState(false)
  const { data } = useQuery({
    queryKey: ["hydrate-todos"],
    queryFn: getTodos,
    refetchOnWindowFocus: false
  });
  const handleUpdate = () => {
    console.log('here')
    setFlag(!flag)
  }
  const deleteMutation = useMutation(async (selectedId: number) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['hydrate-todos'] })
  
      // Snapshot the previous value
      const previousTodos: any = queryClient.getQueryData(['hydrate-todos'])
  
      // Optimistically update to the new value
      queryClient.setQueryData(queryKey, previousTodos.filter((item: any) => item.id !== selectedId));
      console.log(selectedId);
  
      // Return a context object with the snapshotted value
      return { previousTodos }
    })

  return (

    <div>
      {data?.map((item: any, index: number) => (
        <div key={index}>
          <SingleTodo {...item} callback={handleUpdate} handleDelete={(id: number) => deleteMutation.mutate(id)} />
        </div>
      ))}
    </div>
  )
}
