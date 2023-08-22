"use client";

import { supabaseClient } from "../../lib/client";
import { useQuery } from "@tanstack/react-query";
import SingleTodo from "./SingleTodo";

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

  const { data } = useQuery({
    queryKey: ["hydrate-todos"],
    queryFn: getTodos
  });

  return (

    <div>
      {data?.map((item, index) => (
        <SingleTodo {...item} key={index} />
      ))}
    </div>
  )
}
