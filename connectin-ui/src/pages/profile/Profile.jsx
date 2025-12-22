import { Link } from "react-router-dom";

export default function Profile() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-2">My Profile</h2>
      <p>User info will come here</p>

      <Link
        to="/add-service"
        className="inline-block mt-4 bg-black text-white px-4 py-2"
      >
        Add Service
      </Link>
    </div>
  );
}
