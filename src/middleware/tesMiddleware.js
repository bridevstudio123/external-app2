import dotenv from "dotenv";

dotenv.config();

export const tesMiddleware = (req, res, next) => {
	console.log("headers", req.headers);
	console.log("query", req.query);
	console.log("params", req.params);
	next();
};
