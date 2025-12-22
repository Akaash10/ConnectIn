import ServiceCard from "../../components/ServiceCard";

export default function Home() {
  const dummyServices = [
    { id: 1, title: "Carpenter", category: "Wood Work", price: 500 },
    { id: 2, title: "Plumber", category: "Plumbing", price: 400 },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Find Local Services
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {dummyServices.map((s) => (
          <ServiceCard key={s.id} service={s} />
        ))}
      </div>
    </div>
  );
}
