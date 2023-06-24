import { json, type LoaderArgs } from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { type ActionArgs } from "@remix-run/node";
import {
  createPeople,
  deletePeople,
  getPeople,
  type People,
} from "~/db.server";
import { useEffect, useRef } from "react";

export async function loader({ request }: LoaderArgs) {
  const people = await getPeople(request);
  return json(people);
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();

  const { _action, ...values } = Object.fromEntries(formData);

  if (_action === "create") {
    return await createPeople(request, values);
  }

  if (_action === "delete") {
    return await deletePeople(request, values);
  }
}

export default function PeoplePage() {
  const people = useLoaderData<typeof loader>();
  const transition = useNavigation();
  const isAdding =
    transition.state === "submitting" &&
    transition.formData.get("_action") === "create";

  const formRef = useRef<HTMLFormElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAdding) {
      formRef.current?.reset();
      firstNameRef.current?.focus();
    }
  }, [isAdding]);

  return (
    <main>
      <h1>People</h1>
      {people.length ? (
        <ul>
          {people.map((person) => (
            <li key={person.id}>
              {person.first_name + " " + person.last_name}
              <Form method="post" style={{ display: "inline" }}>
                <input type="hidden" name="id" value={person.id} />
                <button type="submit" name="_action" value="delete">
                  x
                </button>
              </Form>
            </li>
          ))}
          <Form method="post" ref={formRef}>
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              ref={firstNameRef}
            />{" "}
            <input type="text" name="last_name" placeholder="Last Name" />{" "}
            <button type="submit" name="_action" value="create">
              Add
            </button>
          </Form>
        </ul>
      ) : (
        <p>No people</p>
      )}
    </main>
  );
}
