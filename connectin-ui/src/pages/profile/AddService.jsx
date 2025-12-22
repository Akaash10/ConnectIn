export default function AddService() {
  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Add Service</h2>

      <input className="w-full border p-2 mb-3" placeholder="Title" />
      <input className="w-full border p-2 mb-3" placeholder="Category" />
      <input className="w-full border p-2 mb-3" placeholder="Price" />

      <button className="w-full bg-black text-white py-2">
        Save Service
      </button>
    </div>
  );
}
