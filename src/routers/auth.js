import dotenv from "dotenv";
import { Router } from "express";

const auth = Router();

dotenv.config();

auth.get("/login", (req, res) => {
	req.session.regenerate(function (err) {
		if (err) throw new Error(err);

		// store user information in session, typically a user id
		console.log("query", req.query.user);
		req.session.user = req.query.user;
		req.session.save(function (err) {
			if (err) {
				console.log(err);
				res.redirect(process.env.PARENT_APP);
			}
			res.redirect("/");
		});
	});
});

auth.get("/logout", (req, res) => {
	req.session.destroy((err) => {
		if (err) {
			throw new Error("Failed to logout");
		}
		res.clearCookie(`${process.env.COOKIE_SESSION_NAME || "_children"}`); // Clear session cookie
		res.redirect(process.env.PARENT_APP);
	});
});

export { auth };
