import { Router } from "express";
import { isAuthenticated, sessionMiddleware } from "../middleware/index.js";
import home from "./home.js";
import auth from "./auth.js";
import dashboard from "./dashboard.js";

const router = Router();

router.use((req, res, next) => {
	// Inspect headers
	console.log("Headers:", req.headers);

	// Inspect the request URL
	console.log("URL:", req.url);

	// Inspect the IP address of the client
	console.log("IP Address:", req.ip);

	// Inspect the referrer
	console.log("Referrer:", req.get("referrer"));

	// Continue to the next middleware or route handler
	next();
});

router.use(sessionMiddleware);
router.use(isAuthenticated); //Is Authenticated middleware

router.use(home, dashboard);

export default router;
