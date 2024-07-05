import { Router } from "express";

const home = Router();

home.get("/", (req, res) => {
	console.log("session", req.session);
	res.render("home", {
		title: "Home",
		name: req.session.user ? req.session.user.name : "",
	});
});

export default home;
