const app = require("./app");
require("dotenv").config();
const connectDatabase = require("./db/db");
const cluster = require("cluster");
const os = require("os");
const numCpu = os.cpus().length;

// Handling uncaught exception

process.on("uncaughtException", (err) => {
  console.log("Uncaught exception ", err.message);
  process.exit(1);
});

connectDatabase();

let server;
if (cluster.isMaster) {
  for (let i = 0; i < numCpu; i++) {
    cluster.fork();
  }
} else {
  server = app.listen(process.env.PORT || 7200, () => {
    console.log(`Server is working on ${process.pid} http://localhost:${process.env.PORT}`);
  });
}

//Unhandled error

process.on("unhandledRejection", (err) => {
  console.log("Unhandle error occured", err.message);
  server.close(() => {
    process.exit(1);
  });
});
