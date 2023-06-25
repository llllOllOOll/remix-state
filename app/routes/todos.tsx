import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { type ActionArgs, json } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { createTodo, deleteTodo, getTodos, toggleTodo } from "~/todos.server";
import { useRef } from "react";
import { useFetcher } from "@remix-run/react";

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
    <div>
      <Form method="post">
        <fieldset>
          <input type="hidden" name="id" />
          <input type="hidden" name="done" />
          <div style={{ display: "inline" }}>
            <label htmlFor="title">Title</label>{" "}
            <input type="text" id="title" name="title" placeholder="Title" />
          </div>{" "}
          <button name="_action" value="create" type="submit">
            Add
          </button>
        </fieldset>
      </Form>
      <ul>
        {todos.length ? (
          todos.map((todo) => (
            <li key={todo.id}>
              <fetcher.Form method="post" style={{ display: "inline" }}>
                <input type="hidden" name="id" value={todo.id} />
                <input type="hidden" name="_action" value="toggle" />
                <input
                  onChange={handleToggle}
                  type="checkbox"
                  name="done"
                  id="done"
                  defaultChecked={todo.done}
                />
              </fetcher.Form>
              {todo.title}{" "}
              <Form method="post" style={{ display: "inline" }}>
                <input type="hidden" name="id" value={todo.id} />
                <button name="_action" value="delete" type="submit">
                  x
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
