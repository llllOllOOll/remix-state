import type { ActionArgs } from "@remix-run/node";

export const action = async ({ request }: ActionArgs) => {
  const dataForm = await request.formData();
  const data = Object.fromEntries(dataForm);
  console.log(data);
  return {
    status: 200,
  };
};

const styleIndex = {
  color: "red",
  width: "100vw",
  height: "100vh",
};

const Index = () => {
  return (
    <div style={styleIndex}>
      <form method="get" action="/foo">
        <div>
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" placeholder="name" />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" placeholder="email" />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Index;
