import PreTodoList from "@/components/PreTodoList";

export default function Home() {

  return (
    <div className="bg-gradient-to-r from-green-400 to-blue-500 max-w-xl min-h-screen m-auto lg:max-w-5xl 2xl:max-w-7xl">
      <div>
      <PreTodoList />
      </div>
    </div>
  );
}
