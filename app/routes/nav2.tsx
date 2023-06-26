export default function Home() {
  return (
    <div>
      <form action="/nav2" method="post">
        <input type="text" name="name" id="name" />
        <input type="text" name="email" id="email" />
        <button>Submit</button>
      </form>
    </div>
  );
}
