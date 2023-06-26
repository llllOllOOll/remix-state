import { json, type ActionArgs, redirect } from "@remix-run/node";
import {
  Form,
  useFetcher,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/node";
import { useEffect, useRef } from "react";

let dataShare = {};

export async function loader({ request }: LoaderArgs) {
  return json(dataShare);
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  dataShare = data;
  console.log("DataShare content:", dataShare);
  return json(data);
}

export default function HomePage() {
  const data = useLoaderData<typeof loader>();
  const transition = useNavigation();

  const fetcher = useFetcher();

  if (transition.formData?.get("name") === "John Doe") {
    console.log("Submitting John Doe", transition.state);
  }

  if (transition.state === "idle") {
    console.log("Idle", transition.state);
  }
  if (transition.state === "submitting") {
    console.log("Submitting", transition.state);
  }

  if (transition.state === "loading") {
    console.log("Loading", transition.state);
  }
  if (fetcher.state === "submitting") {
    console.log("Submitting", fetcher.state);
  }
  const formRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  const isAddding = fetcher.state === "submitting";

  useEffect(() => {
    formRef.current?.reset();
    nameRef.current?.focus();
  }, [isAddding]);

  return (
    <div>
      <h1>Home Page</h1>
      <fetcher.Form ref={formRef} action="/nav" method="post">
        <input type="text" name="name" id="name" ref={nameRef} />
        <button type="submit">Submit</button>
      </fetcher.Form>
      <pre
        style={{
          opacity: transition.formData?.get("id") === data.id ? 0.5 : 1,
        }}
      >
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
