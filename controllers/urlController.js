const urlModel = require("../models/urlModel");
const validUrl = require("valid-url");
const { SET_ASYNC, GET_ASYNC } = require("../caching/cache");
const shortid = require("shortid");
const axios = require('axios');

const createUrl = async (req, res) => {
  try {
    const reqBody = req.body;
    const { longUrl } = reqBody;
    if (!longUrl) {
      console.log("No url present here");
      return res
        .status(400)
        .send({
          status: false,
          message: "Please enter long url for shortening",
        });
    }
    if (Object.keys(reqBody).length > 1) {
      return res
        .status(400)
        .send({ status: false, message: "You cannot add extra fields" });
    }
    if (!validUrl.isUri(longUrl)) {
      return res
        .status(400)
        .send({ status: false, message: "Url entered is not valid" });
    }
    let cache = await GET_ASYNC(`${longUrl}`);
    cache = JSON.parse(cache);
    if (cache) {
      return res
        .status(201)
        .send({ status: true, message: "Already exists", data: cache });
    }
    let existUrl = await urlModel
      .findOne({ longUrl })
      .select({ urlCode: 1, shortUrl: 1, longUrl: 1, _id: 0 });
    if (existUrl)
      return res
        .status(201)
        .send({ status: false, message: "Already exists", data: existUrl });

    let liveLink = false;
    await axios
      .get(longUrl)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          liveLink = true;
        }
      })
      .catch(() => (liveLink = false));
    if (!liveLink)
      return res
        .status(400)
        .send({ status: false, message: `${longUrl} does not exist` });

    let urlCode = shortid.generate();
    const shortUrl = process.env.baseUrl + urlCode;
    const savedData = {
      urlCode: urlCode,
      shortUrl: shortUrl,
      longUrl: longUrl,
    };

    const newUrl = await urlModel.create(savedData);
    return res
      .status(201)
      .send({ status: false, message: "New url is added", data: newUrl });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send({ status: false, message: err.message });
  }
};

const getUrl = async (req, res) => {
  try {
    const urlCode = req.params.urlCode;
    if (!shortid.isValid(urlCode))
      return res
        .status(400)
        .send({
          status: false,
          message: `'${urlCode}' this shortUrl is invalid`,
        });
    let cache = await GET_ASYNC(`${urlCode}`);
    cache = JSON.parse(cache);
    if (cache) {
      return res.status(302).redirect(cache.longUrl);
    }
    const existUrl = await urlModel.findOne({ urlCode });
    if (!existUrl)
      return res.status(404).json({ message: "No url found, create new one" });

    await SET_ASYNC(`${urlCode}`, JSON.stringify(existUrl), 'EX', 60*60*5);
    return res.status(302).redirect(existUrl.longUrl);
  } catch (err) {
    console.log(err.message);
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = { createUrl, getUrl };
