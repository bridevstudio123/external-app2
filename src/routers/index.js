import { Router } from "express";
import { isAuthenticated, sessionMiddleware } from "../middleware/index.js";
import home from "./home.js";
import auth from "./auth.js";
import dashboard from "./dashboard.js";

const router = Router();

router.use(sessionMiddleware);
router.use(isAuthenticated); //Is Authenticated middleware

router.use(home, dashboard);

export default router;
