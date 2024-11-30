const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

/** return signed JWT from user data. */

function createToken(user) {
  console.assert(user.isAdmin !== undefined,
      "createToken passed user without isAdmin property");

  let payload = {
    username: user.username,
    isAdmin: user.isAdmin || false,
  };

  return jwt.sign(payload, SECRET_KEY);
}

module.exports = { createToken };

// Test token generation (add this temporarily at the bottom of tokens.js)
if (require.main === module) { // Ensures this runs only when executing tokens.js directly
  const testUser = { username: "aladamm78", isAdmin: true };
  const token = createToken(testUser);
  console.log("Generated Token:", token);
}
