import dotenv from "dotenv";

dotenv.config();

export const isAuthenticated = (req, res, next) => {
	if (req.session.user) {
		return next();
	}
	res.redirect(process.env.PARENT_APP);
};
