import dotenv from "dotenv";
import { decryptData } from "../helpers/utils.js";

dotenv.config();
const privateKey = process.env.PRIVATE_KEY;

const regenerateSession = (req, res, decryptedData, next) => {
	req.session.regenerate((err) => {
		if (err) {
			console.error("Error regenerating session:", err);
			return res.send({ error: "Session regeneration failed" });
		}

		req.session.user = decryptedData;
		req.session.save((err) => {
			if (err) {
				console.error("Error saving session:", err);
				return res.send({ error: "Session save failed" });
			}
			res.redirect("/");
		});
	});
};

const createSession = (req, res, code, next) => {
	let decryptedData;
	try {
		decryptedData = decryptData(code, privateKey);
	} catch (err) {
		console.error("Error decrypting data:", err);
		return res.send({ error: "Decryption failed" });
	}

	regenerateSession(req, res, decryptedData, next);
};

export const isAuthenticated = (req, res, next) => {
	const { code, checkMiddleware } = req.query;

	// Respond with success code if checkMiddleware is present
	if (checkMiddleware) {
		return res.status(204);
	}

	if (req.session.user) {
		if (code) {
			res.redirect("/");
		}
		return next();
	}

	if (code) {
		return createSession(req, res, code, next);
	}

	res.redirect(process.env.PARENT_APP);
};
