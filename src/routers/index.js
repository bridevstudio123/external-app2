import { Router } from "express";
import {
	isAuthenticated,
	sessionMiddleware,
	tesMiddleware,
} from "../middleware/index.js";
import home from "./home.js";
import auth from "./auth.js";
import dashboard from "./dashboard.js";

const router = Router();

router.use(sessionMiddleware);
router.use(tesMiddleware);

router.use(home);
router.use(auth);

//Is Authenticated middleware
router.use(isAuthenticated);

router.use(dashboard);

export default router;
