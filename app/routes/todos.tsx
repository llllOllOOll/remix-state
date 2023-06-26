import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { type ActionArgs, json } from "@remix-run/node";
import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { createTodo, deleteTodo, getTodos, toggleTodo } from "~/todos.server";
import { useRef } from "react";
import { useFetcher } from "@remix-run/react";

import styleTodos from "~/styles/todos.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styleTodos }];
};

export async function loader({ request }: LoaderArgs) {
  const todos = await getTodos(request);
  return json(todos);
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);

  if (_action === "delete") {
    return await deleteTodo(request, values);
  }

  if (_action === "create") {
    return await createTodo(request, values);
  }

  if (_action === "toggle") {
    return await toggleTodo(request, values);
  }
}

export default function TodosPage() {
  const todos = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    fetcher.submit(e.target.form, { replace: true });
  };

  return (
    <div className="container">
      <Form method="post" className="flex">
        <div className="todo-input-wrap">
          <input type="hidden" name="id" />
          <input type="hidden" name="done" />
          <input
            className="todo-input-add"
            type="text"
            id="title"
            name="title"
            placeholder="type your new task"
          />
        </div>
        <button className="btn-add" name="_action" value="create" type="submit">
          Add
        </button>
      </Form>

      <ul>
        {todos.length ? (
          todos.map((todo) => (
            <li key={todo.id}>
              <div>
                <fetcher.Form method="post" style={{ display: "inline" }}>
                  <input type="hidden" name="id" value={todo.id} />
                  <input type="hidden" name="_action" value="toggle" />
                  <input
                    className="form-input-checkbox"
                    onChange={handleToggle}
                    type="checkbox"
                    name="done"
                    id="done"
                    defaultChecked={todo.done}
                  />
                </fetcher.Form>{" "}
                <span className="todo-title"> {todo.title}</span>
              </div>
              <Form method="post" style={{ display: "inline" }}>
                <input type="hidden" name="id" value={todo.id} />
                <button
                  className="btn-delete"
                  name="_action"
                  value="delete"
                  type="submit"
                >
                  X
                </button>
              </Form>
            </li>
          ))
        ) : (
          <p>No todos</p>
        )}
      </ul>
    </div>
  );
}
