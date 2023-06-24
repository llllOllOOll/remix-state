import { json, type LinksFunction, type LoaderArgs } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { getSession } from "~/sessions";
import styles from "~/styles/global.css";

export type Todo = {
  id: string;
  title: string;
  done: string;
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export async function loader({ request }: LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const data: Todo[] = session.get("todos") || [];

  return json(data);
}

export default function TodosListPage() {
  const data = useLoaderData<typeof loader>();
  return (
    <main className="">
      <Outlet />
      <div>
        <ul>
          {data.map((todo) => (
            <li key={todo.id}>
              <Link to={todo.id}>{todo.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
