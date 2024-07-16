# Simple Login Guide

Welcome! This readme contains the code and instructions for setting up and running a simple login for external apps.

## Requirements

This is the requirement that is needed before adding external apps in parent app.

- `Generate Public and Private Key`: The public key is for the parent app to encrypt user session and private key is for the children app to decrypt user session.

```js
// example public key
-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC6rMeqUtKtUTBkjDtQ8rC/dNJi
ofemTqnz4QF6i0AuHmy6or1L+tX4Prpiqrtuwx75PU5AnqZlbOGoEhMQF7Or9OyT
4NsHvdQlGNQreU54yHQuelUHErngOIpQdmI97J7IOZ7J7dcz5DK6iL+GDnP2UrPf
PEjj6SFRzdfgK/7IUwIDAQAB
-----END PUBLIC KEY-----

// example private key
-----BEGIN RSA PRIVATE KEY-----
MIICXAIBAAKBgQC6rMeqUtKtUTBkjDtQ8rC/dNJiofemTqnz4QF6i0AuHmy6or1L
+tX4Prpiqrtuwx75PU5AnqZlbOGoEhMQF7Or9OyT4NsHvdQlGNQreU54yHQuelUH
ErngOIpQdmI97J7IOZ7J7dcz5DK6iL+GDnP2UrPfPEjj6SFRzdfgK/7IUwIDAQAB
AoGBAJVa9ilVONCIu/JGrJK4iie0vTtDIZSDLcE9jmRQk5oSp6Wv3Uq0N4v2DEQz
G+Gj5d0+aqSTCsjtk6JYS749aHdXjeOWoUMwGSKcJpfbVrIMnFNmfxELWW5MImq8
ZUqjkkKrK/LWL5UDTVlxiWXtNSInJiOPLWvLwdRpgDjluO6ZAkEA3xRlJ6vErPDS
3FYO+m+Yfqelv9HHbsGsJZSEooYm325fDNCrrxTShk3AMiD7CE9fEr473B31KliA
XY1RGZ29nQJBANY5Edyo39ywv2HUuh0vJJ+Y98afjFugjKtSSnCC0DYBTQ0dzlKC
wkta1hab7cYldAXsR8YLn3n2HpsKuMGvsq8CQFBxmVyp61115oQAIJycu4AI0pOO
gX1mJ77RhNbay4/MzEfhw9d6CcTWqtUo4X2Iqb8njIx+3RbtHTUfLbywDl0CQDHi
Vjt5A7AjZF2GqNQ07yVO/Ju++XM4vqkCX501iQCaavPb9fiWxGHBxEq9gq/6drsO
W2RNvpQq8NOPupg3rrcCQH2p8m2JhYCtlHkC5j5b4LC5T/OzQKCOLNy/TuaJoj/4
EnIJGpmlf1iCrK7jzVfjBiZGjdYaavv/ti9nXcCNnb0=
-----END RSA PRIVATE KEY-----
```

- `link`: This is the link to external app, that has the middleware to authenticate incoming request.

```js
// example
import { Router } from "express";
import { isAuthenticated, sessionMiddleware } from "../middleware/index.js";
import home from "./home.js";
import dashboard from "./dashboard.js";

const router = Router();

router.use(sessionMiddleware);
router.use(isAuthenticated); //The Authenticate middleware

router.use(home, dashboard);

export default router;
```

## Implementation Guide

### Login Flow

1. **Redirection**: From the parent app, a redirect URL containing the encrypted user session data. Example URL: `https://children.app.com/?code=xxxxxxxxxxxxxxxx`
2. **Session Handling in External App**:
   - Check for user sessions.
   - If a session exists, proceed with the request.
   - If a code query exists, decrypt the code and create a new session for the external app.

## Example Implementation

Below is an example code implementing the simple login flow using Express.js, express-session, dotenv, crypto, and EJS.

### Environment Variables

- `PRIVATE_KEY`: The private key used for decrypting the user session code.
- `PARENT_APP`: The URL of the parent app.

### Middleware and Utility Function

#### Utility Function: `decryptData`

This function is used to decrypt code that contains user sessions

```js
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

export const decryptData = (code, privateKey) => {
	//Convert the code query into buffer form
	const encryptedData = Buffer.from(code, "base64");

	//Decrypt the user session using private key
	const decryptedDataBuffer = crypto.privateDecrypt(privateKey, encryptedData);

	//Convert the decrypted data buffer into utf8 string
	const decryptedDataString = decryptedDataBuffer.toString("utf8");

	//Parse the string into JSON object
	const decryptedData = JSON.parse(decryptedDataString);

	return decryptedData;
};
```

#### Middleware Function: `isAuthenticated`

This middleware function is used to check if the incoming request contains user session or code query, if not it will redirect to parent app.

```js
import dotenv from "dotenv";

dotenv.config();

export const isAuthenticated = (req, res, next) => {
	const { code, check } = req.query;

	// Respond with success code if checkMiddleware is present
	if (check) {
		return res.status(200).send({ message: "middleware is active" });
	}

	if (req.session.user) {
		// If there is code query even though there is already session,
		// it will redirect to children home path
		if (code) {
			res.redirect("/"); // Redirect to children home path
		}
		return next();
	}

	// Call the createSession function if there is code query
	if (code) {
		return createSession(req, res, code, next);
	}

	res.redirect(process.env.PARENT_APP); // Redirect to parent home path
};
```

#### Function: `createSession`

This function is used to call `decryptData` function and `regenerateSession` function.

```js
import dotenv from "dotenv";
import { decryptData } from "../helpers/utils.js";

dotenv.config();

const privateKey = process.env.PRIVATE_KEY;

const createSession = (req, res, code, next) => {
	let decryptedData;
	try {
		// Call decryptData function
		decryptedData = decryptData(code, privateKey);
	} catch (err) {
		console.error("Error decrypting data:", err);
		return res.send({ error: "Decryption failed" });
	}

	// Call regenerateSession function
	regenerateSession(req, res, decryptedData, next);
};
```

#### Function: `regenerateSession`

This function is used to regenerate sessions based on the decrypted data.

```js
import dotenv from "dotenv";
import { decryptData } from "../helpers/utils.js";

const regenerateSession = (req, res, decryptedData, next) => {
	req.session.regenerate((err) => {
		if (err) {
			console.error("Error regenerating session:", err);
			return res.send({ error: "Session regeneration failed" });
		}

		// Assign the user session
		req.session.user = decryptedData;

		// Save the user session
		req.session.save((err) => {
			if (err) {
				console.error("Error saving session:", err);
				return res.send({ error: "Session save failed" });
			}
			res.redirect("/"); // Redirect to children home path
		});
	});
};
```
