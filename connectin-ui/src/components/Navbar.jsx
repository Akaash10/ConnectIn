import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 border-b">
      <Link to="/" className="font-bold text-xl">
        ConnectIn
      </Link>

      <div className="space-x-4">
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/profile">Profile</Link>
      </div>
    </nav>
  );
}
