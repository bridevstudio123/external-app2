import { Router } from "express";
import dotenv from "dotenv";
dotenv.config();

const dashboard = Router();

dashboard.get("/dashboard", (req, res) => {
	res.render("dashboard", {
		title: "Dashboard",
		name: req.session.user ? req.session.user.name : "",
		email: req.session.user ? req.session.user.email : "",
	});
});

export default dashboard;
