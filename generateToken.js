const jwt = require("jsonwebtoken");

// Replace these with the details for the user you want to generate a token for
const SECRET_KEY = "38bfe6d8a19a207edb0e583b2f6b731530dd9725b0809dc328c71b81e8507664376aa51cab195cfbe1fb0220661442ad49876f1e6b810f692772e6cb70250aae";
const payload = {
  username: "testuser", // Use an existing username
  isAdmin: false,       // Set based on the user's role
};

const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" }); // Token valid for 1 hour

console.log("Generated Token:", token);
