import { Router } from "express";
import { getTransactions, postNewEntry } from "../controllers/transactionsController.js";
import { validateToken } from "../middlewares/authMiddleware.js";

const transactionsRouter = Router();

transactionsRouter.use(validateToken);

transactionsRouter.get("/", getTransactions); // auth required
transactionsRouter.post("/new-entry", postNewEntry); // auth required

export default transactionsRouter;