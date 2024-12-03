"use strict";

/** Routes for authentication. */

const jsonschema = require("jsonschema");

const User = require("../models/user");
const express = require("express");
const router = new express.Router();
const { createToken } = require("../helpers/tokens");
const userAuthSchema = require("../schemas/userAuth.json");
const userRegisterSchema = require("../schemas/userRegister.json");
const { BadRequestError } = require("../expressError");
const jwt = require("jsonwebtoken");

/** POST /auth/token:  { username, password } => { token }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/token", async function (req, res, next) {
  try {
    console.log("Login request received:", req.body); // Log incoming data

    const validator = jsonschema.validate(req.body, userAuthSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const { username, password } = req.body;
    const user = await User.authenticate(username, password);

    const token = createToken(user);
    console.log("User authenticated, returning token:", {
      roles: user.isAdmin ? [5150] : [0], // Admin or regular user
      accessToken: token
    }); // Debug log

    return res.json({
      roles: user.isAdmin ? [5150] : [0],
      accessToken: token
    });
  } catch (err) {
    console.error("Error during authentication:", err); // Log errors
    return next(err);
  }
});





/** POST /auth/register:   { user } => { token }
 *
 * user must include { username, password, firstName, lastName, email }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/register", async function (req, res, next) {
  console.log(req.body);  // This will log the data sent from the frontend 
 
  try {
    const validator = jsonschema.validate(req.body, userRegisterSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const newUser = await User.register({ ...req.body, isAdmin: false });
    const token = createToken(newUser);
    return res.status(201).json({ token });
  } catch (err) {
    return next(err);
  }
});

/** GET /auth/refresh => { accessToken }
 * 
 * Returns a new access token if refresh token is valid
 * 
 * Authorization required: valid refresh token
 */
router.get("/refresh", async function (req, res, next) {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    
    const refreshToken = cookies.jwt;
    const foundUser = await User.findByRefreshToken(refreshToken);
    if (!foundUser) return res.sendStatus(403);

    // verify refresh token
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || foundUser.username !== decoded.username) {
          return res.sendStatus(403);
        }

        const accessToken = createToken(foundUser);
        res.json({ 
          roles: foundUser.isAdmin ? [5150] : [0],
          accessToken 
        });
      }
    );
  } catch (err) {
    return next(err);
  }
});

/** POST /auth/logout => { success: true }
 * 
 * Clears refresh token cookie
 * 
 * Authorization required: none
 */
router.post("/logout", (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
  res.json({ success: true });
});

module.exports = router;
