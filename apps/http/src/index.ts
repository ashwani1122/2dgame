import express from "express";
import { router } from "./routes/v1/index.js";
import cors from "cors";
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors())
app.use("/api/v1", router);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
