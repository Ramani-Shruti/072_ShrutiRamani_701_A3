import { Link } from "react-router-dom";
import Nav from "./Nav";

export default function Home() {
  return (
    <div>
      <Nav />
      <h2>Welcome {localStorage.getItem("name")}</h2>
      <ul>
        <li><Link to="/profile">Page 1 - View my profile</Link></li>
        <li><Link to="/leave">Page 2 - Apply for leave / see my leaves</Link></li>
      </ul>
    </div>
  );
}
