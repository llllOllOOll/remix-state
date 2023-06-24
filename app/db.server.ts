import { json, redirect } from "@remix-run/node";
import { commitSession, getSession } from "./sessions";

export type People = {
  id: string;
  first_name: string;
  last_name: string;
};

export async function getPeople(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  const people: People[] = session.get("people") || [
    { id: "1", first_name: "John", last_name: "Doe" },
  ];
  return people;
}

export async function createPeople(
  request: Request,
  data: { [k: string]: FormDataEntryValue }
) {
  const session = await getSession(request.headers.get("Cookie"));
  // const formData = await request.formData();

  //const newPerson = Object.fromEntries(formData) as People;
  //newPerson.id = (Math.random() * 1000000).toString();
  data.id = (Math.random() * 1000000).toString();

  const peopleData: People[] = await getPeople(request);
  const people = [...peopleData, data];

  session.set("people", people);

  return json(people, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export async function deletePeople(
  request: Request,
  data: { [k: string]: FormDataEntryValue }
) {
  const session = await getSession(request.headers.get("Cookie"));

  const peopleData: People[] = await getPeople(request);

  const updatedPeople = peopleData.filter((person) => person.id !== data["id"]);
  const people = [...updatedPeople];

  session.set("people", people);

  return json(people, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}
