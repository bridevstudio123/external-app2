import dotenv from "dotenv";
import session from "express-session";

dotenv.config();

const sameSite = process.env.NODE_ENV === "development" ? "lax" : "none";

// Set up express-session middleware
export const sessionMiddleware = session({
	name: process.env.COOKIE_SESSION_NAME,
	secret: process.env.COOKIE_SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
});
