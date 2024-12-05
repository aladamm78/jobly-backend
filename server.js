"use strict";

const app = require("./app");
const { PORT } = require("./config");
const cors = require('cors');


app.use(cors({
  origin: 'https://jobly-frontend-u8ms.onrender.com', // Allow requests only from the frontend
  credentials: true,              // Allow credentials (cookies, authorization headers, etc.)
}));


app.listen(PORT, function () {
  console.log(`Started on http://localhost:${PORT}`);
});
