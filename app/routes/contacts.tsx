import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { commitSession, getSession } from "~/sessions";

export const loader = async ({ request }: LoaderArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  console.log(session.data);
  if (session.has("userId")) {
    console.log(session.data);
    console.log("user is logged in");
    const data = session.data as {
      userID: string;
      name: string;
      email: string;
    };
    return json(data);
  }

  const data = { data: session.get("error") };

  return json(data, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export async function action({ request }: ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  console.log(data);
  session.set("userId", "1");
  session.set("name", data.username);
  session.set("email", data.email);
  //let userId = "1";

  // Login succeeded, send them to the home page.
  return json(data, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function Login() {
  const data = useLoaderData<typeof loader>();
  return (
    <div>
      <form method="POST">
        <label>
          Username:{" "}
          <input type="text" name="username" defaultValue={data.name} />
        </label>
        <label>
          Email: <input type="text" name="email" defaultValue={data.email} />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
