import {
  json,
  type ActionArgs,
  redirect,
  type LoaderArgs,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { commitSession, getSession } from "~/sessions";

export type Todo = {
  id: string;
  title: string;
  done: string;
};

export async function loader({ request, params }: LoaderArgs) {
  if (params.slug === "new") {
    return json(null, { status: 200 });
  } else {
    const session = await getSession(request.headers.get("Cookie"));
    const todos: Todo[] = session.get("todos") || [];

    console.log("Todo Slug:", params.slug);
    const todo = todos.find((todo) => todo.id === params.slug);
    return json(todo, { status: 200 });
  }
}

export async function action({ request, params }: ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const formData = await request.formData();

  const data = Object.fromEntries(formData) as Todo;

  if (!data.title) {
    return json({ errors: "Title is required" }, { status: 400 });
  }

  if (params.slug === "new") {
    data.id = crypto.randomUUID();

    const todos = session.get("todos") || [];
    todos.push(data);

    session.set("todos", todos);

    return redirect("/todos", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }
  return json(null);
}

export default function Todos() {
  const transition = useNavigation();
  const actionData = useActionData<typeof action>();
  const todo = useLoaderData<typeof loader>();

  console.log("Todo:", todo?.title);
  return (
    <div>
      <Form method="post" key={todo?.id ?? "new"}>
        <fieldset disabled={transition.state === "submitting"}>
          <div>
            <label htmlFor="title">Title</label>{" "}
            <input
              type="text"
              name="title"
              id="title"
              defaultValue={todo?.title}
            />
          </div>
          {actionData?.errors ? <div>{actionData.errors}</div> : null}
          <div>
            <label htmlFor="done">Done</label>{" "}
            <input
              type="text"
              name="done"
              id="done"
              defaultValue={todo?.done}
            />
          </div>
          <button type="submit">
            {transition.state === "submitting" ? "Creating..." : "Create"}
          </button>
        </fieldset>
      </Form>
    </div>
  );
}
