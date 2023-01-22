const { createClient } = require("redis");
const { promisify } = require("util");
require("dotenv").config();

const redisClient = createClient(
    17389,
    process.env.RED_URL,
    {no_ready_check: true}
);

redisClient.auth(process.env.RED_PASS, (err) => {
    if(err) throw err;
})

redisClient.on("connect", async () => {
  console.log("connected to redis");
});

redisClient.on("error", async (err) => {
    console.log("error redis ", err);
  });

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

module.exports = { GET_ASYNC, SET_ASYNC };
