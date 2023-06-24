import { json } from "@remix-run/node";
import { commitSession, getSession } from "./sessions";

export type People = {
  id?: string;
  first_name: string;
  last_name: string;
  done: boolean;
};

export async function getPeople(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  const people: People[] = session.get("people") || [
    { id: "1", first_name: "John", last_name: "Doe", done: true },
  ];
  return people;
}

export async function createPeople(
  request: Request,
  data: { [k: string]: FormDataEntryValue }
) {
  const session = await getSession(request.headers.get("Cookie"));
  const d: People = data;

  d.id = (Math.random() * 1000000).toString();
  d.done = false;

  data.id = (Math.random() * 1000000).toString();

  const peopleData: People[] = await getPeople(request);
  const people = [...peopleData, d];

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

export async function togglePeople(
  request: Request,
  data: { [k: string]: FormDataEntryValue }
) {
  const session = await getSession(request.headers.get("Cookie"));

  const peopleData: People[] = await getPeople(request);

  const updatedPeople = peopleData.map((person) => {
    if (person.id === data["id"]) {
      person.done = !person.done;
      return person;
    }
    return person;
  });

  const people = [...updatedPeople];

  session.set("people", people);

  return json(people, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}
