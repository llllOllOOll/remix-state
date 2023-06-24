import { json } from "@remix-run/node";
import { commitSession, getSession } from "./sessions";

export type Todo = {
  id?: string;
  title: string;
  done: boolean;
};

export async function getTodos(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  const todos: Todo[] = session.get("todos") || [
    { id: "1", title: "Task 1", done: true },
  ];
  return todos;
}

export async function createTodo(
  request: Request,
  data: { [k: string]: FormDataEntryValue }
) {
  const session = await getSession(request.headers.get("Cookie"));
  const todo: Todo = data;

  todo.id = crypto.randomUUID();
  todo.done = false;

  const todosData: Todo[] = await getTodos(request);
  const todos = [...todosData, todo];

  session.set("todos", todos);

  return json(todos, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export async function deleteTodo(
  request: Request,
  data: { [k: string]: FormDataEntryValue }
) {
  const session = await getSession(request.headers.get("Cookie"));

  const todoData: Todo[] = await getTodos(request);

  const updatedTodo = todoData.filter((todo) => todo.id !== data["id"]);
  const todos = [...updatedTodo];

  session.set("todos", todos);

  return json(todos, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export async function toggleTodo(
  request: Request,
  data: { [k: string]: FormDataEntryValue }
) {
  const session = await getSession(request.headers.get("Cookie"));

  const todosData: Todo[] = await getTodos(request);

  const updatedTodos = todosData.map((todo) => {
    if (todo.id === data["id"]) {
      todo.done = !todo.done;
      return todo;
    }
    return todo;
  });

  const todos = [...updatedTodos];

  session.set("todos", todos);

  return json(todos, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}
