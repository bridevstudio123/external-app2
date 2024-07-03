import { Router } from "express";
import { isAuthenticated, sessionMiddleware } from "../middleware/index.js";
import { home } from "./home.js";
import { auth } from "./auth.js";

const router = Router();

router.use(sessionMiddleware);

router.use(auth);

//Is Authenticated middleware
router.use(isAuthenticated);

router.use(home);

export default router;
