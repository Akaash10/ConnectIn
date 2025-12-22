import { motion } from "framer-motion";

export default function ServiceCard({ service }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="p-4 bg-white shadow rounded-xl"
    >
      <h3 className="font-bold">{service.title}</h3>
      <p>{service.description}</p>
    </motion.div>
  );
}
