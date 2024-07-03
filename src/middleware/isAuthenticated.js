import dotenv from "dotenv";

dotenv.config();

export const isAuthenticated = (req, res, next) => {
	console.log("req middleware", req);
	// if (req.session.user) {
	// 	return next();
	// }
  return next();
	// res.redirect(process.env.PARENT_APP);
};
