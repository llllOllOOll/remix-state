import { json, type LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader = ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const data = Object.fromEntries(url.searchParams) as {
    name: string;
    email: string;
  };
  return json(data);
};

const Foo = () => {
  const { name, email } = useLoaderData<typeof loader>();
  return (
    <div>
      Name: {name} Email: {email} Foo
    </div>
  );
};

export default Foo;
