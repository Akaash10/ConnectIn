import { useParams } from "react-router-dom";

export default function ServiceDetails() {
  const { id } = useParams();

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Service Details</h2>
      <p>Service ID: {id}</p>
    </div>
  );
}
