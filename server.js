const express = require("express");

const userRouter = require("./users/userRouter.js");
const postRouter = require("./posts/postRouter.js");

const server = express();

server.use(express.json());
server.use(logger);

server.use("/api/users", userRouter);
server.use("/api/posts", postRouter);

const greeting = process.env.GREETING;

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>
  <p>${greeting}</p>`);
});

//error handler
server.use((err, req, res, next) => {
  // console.error(err);

  res.status(err.status).json({ message: err.message });
});

//custom middleware

function logger(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url}`);

  next();
}

module.exports = server;
