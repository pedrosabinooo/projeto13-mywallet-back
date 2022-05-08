import express, { json } from "express";
import dotenv from "dotenv";

import authRouter from "./routes/authRouter.js";
import transactionsRouter from "./routes/transactionsRouter.js";

dotenv.config();

const app = express();
app.use(json()); // hof

// routes
app.use(authRouter);
app.use(transactionsRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});