import dotenv from "dotenv";
import { Router } from "express";
import { decryptData } from "../helpers/utils.js";

const auth = Router();
dotenv.config();

const privateKey = process.env.PRIVATE_KEY;

auth.get("/login", (req, res) => {
	const { code } = req.query;
	const decryptedData = decryptData(code, privateKey);

	req.session.regenerate(function (err) {
		if (err) throw new Error(err);

		// store user information in session, typically a user id
		req.session.user = decryptedData;
		req.session.save(function (err) {
			if (err) {
				console.error("Error saving session:", err);
				return res.send({ error: "Session save failed" });
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

export default auth;
