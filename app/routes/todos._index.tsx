import { json, type LoaderArgs } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { getSession } from "~/sessions";

export default function TodosListPage() {
  return (
    <div>
      <Link to="/todos/new">Create New Todo</Link>
    </div>
  );
}
