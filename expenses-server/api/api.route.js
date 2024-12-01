import { Router } from "express";
import expensesRouter from "./expenses/expenses.route.js";

const apiRouter = Router();

apiRouter.use("/expenses", expensesRouter);

export default apiRouter;
