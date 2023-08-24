import getQueryClient from "@/utils/getQueryClient";
import Hydrate from "@/utils/hydrate.client";
import { dehydrate } from "@tanstack/query-core";
import { supabaseClient } from "../../lib/client";

import TodoList from "./TodoList";

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

export default function PreShowList() {

  const queryClient = getQueryClient();

  queryClient.prefetchQuery(["hydrate-todos"], getTodos);
  
  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <div>
        <TodoList />
      </div>
    </Hydrate>
  );
}
