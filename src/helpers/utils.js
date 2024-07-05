import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

export const decryptData = (code, privateKey) => {
	console.log("function", code);
	const encryptedData = Buffer.from(code, "base64");
	const decryptedDataBuffer = crypto.privateDecrypt(privateKey, encryptedData);
	const decryptedDataString = decryptedDataBuffer.toString("utf8");
	const decryptedData = JSON.parse(decryptedDataString);
	return decryptedData;
};
