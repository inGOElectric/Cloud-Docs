import axios from "axios";

const authClient = axios.create({
  baseURL: "http://localhost:4000",
});

export default authClient;
