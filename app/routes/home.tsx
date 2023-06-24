import { LoaderArgs, json } from "@remix-run/node";

export const loader = ({ request }: LoaderArgs) => {
  const data = request.url;
  console.log("data", data);
  return json({
    hello: "world",
  });
};
const Home = () => {
  return <div>home</div>;
};

export default Home;
