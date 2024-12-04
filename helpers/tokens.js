const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

/** return signed JWT from user data. */

function createToken(user) {
  console.assert(user.isAdmin !== undefined,
      "createToken passed user without isAdmin property");

  let payload = {
    username: user.username,
    roles: user.isAdmin ? [5150] : [0] // Assign roles based on isAdmin
  };

  console.log("Creating token with roles:", payload.roles); // Debug log

  return jwt.sign(payload, SECRET_KEY);
}



module.exports = { createToken };
