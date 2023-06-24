import { Link } from "@remix-run/react";
import styleMenu from "./menu.css";

export const links = () => {
  return [{ rel: "stylesheet", href: styleMenu }];
};

export const MainMenu = () => {
  return (
    <nav>
      <Link to="/home">Home</Link>
      <Link to="/contacts">Contacts</Link>
    </nav>
  );
};
