export default function Login() {
  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Login</h2>

      <input
        type="email"
        placeholder="Email"
        className="w-full border p-2 mb-3"
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full border p-2 mb-3"
      />

      <button className="w-full bg-black text-white py-2">
        Login
      </button>
    </div>
  );
}
