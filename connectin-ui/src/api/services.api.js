import api from "./axios";

export const getServices = (category) =>
  api.get(`/services?category=${category}`);

export const addService = (data) =>
  api.post("/services", data);
