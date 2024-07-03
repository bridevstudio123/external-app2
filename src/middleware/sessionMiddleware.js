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
	cookie: {
		secure: process.env.NODE_ENV !== "development", // Set it to true if using HTTPS
		sameSite: sameSite,
		httpOnly: true,
		maxAge: 24 * 60 * 60 * 1000, // 1 day,
		domain:
			process.env.NODE_ENV === "development" ? "localhost" : process.env.DOMAIN,
	},
});
