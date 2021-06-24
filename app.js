var Sentiment = require("sentiment");
require("dotenv").config();
const axios = require("axios");
const fs = require("fs");
const placeOrder = require("./helpers/placeOrder");
const { twitterUserId, shouldInclude, interval } = require("./config");

const options = {
  headers: {
    Authorization: "Bearer " + process.env.BEARER_TOKEN,
  },
};

const POSITIVE_THRESHOLD = 1;
const NEGATIVE_THRESHOLD = -1;

async function getScore(text) {
  var sentiment = new Sentiment();
  var result = sentiment.analyze(text);
  return result.score;
}

let lastProcessedId = 0;

function loadLatest() {
  try {
    const dataFromFs = fs.readFileSync("./tweetId.txt", "utf8");
    //console.log(dataFromFs);
    lastProcessedId = dataFromFs;
    console.log("Loaded last processed Tweet ID");
  } catch (error) {
    console.error("error reading from file", error.message);
  }
}

async function startProcessing() {
  console.log("Scanning tweets...");

  let tweets = await axios.get(
    `https://api.twitter.com/2/users/${twitterUserId}/tweets?exclude=retweets&since_id=${lastProcessedId}&max_results=10`,
    options
  );

  console.log(tweets.data.meta.result_count, "new tweet(s) found!");
  if (tweets.data.meta.result_count == 0) return;
  tweets = tweets.data.data;
  console.log("tweets", tweets);
  let results = [];
  for (let i = 0; i < tweets.length; i++) {
    let obj = {};
    const tweet = tweets[i];
    let text = tweet.text.replace(/(?:https?):\/\/[\n\S]+/g, ""); // remove links
    if (new RegExp(shouldInclude.join("|")).test(text.toLowerCase())) {
      obj = {
        text: text,
      };
      let score = await getScore(text);

      let sentiment =
        score >= POSITIVE_THRESHOLD
          ? "POSITIVE"
          : score <= NEGATIVE_THRESHOLD
          ? "NEGATIVE"
          : "NEUTRAL";

      obj["sentiment"] = sentiment;
      obj["tweetId"] = tweet.id;
      if (sentiment != "NEUTRAL") results.push(obj);
      if (results.length) break;
    }
  }
  console.log("Results", JSON.stringify(results, null, 4));

  if (results.length) {
    //Execute trade
    results[0].sentiment == "POSITIVE" ? placeOrder("BUY") : placeOrder("SELL");

    //Update the latest tweet ID
    fs.writeFileSync("./tweetId.txt", results[0].tweetId);
  } else {
    fs.writeFileSync("./tweetId.txt", tweets[tweets.length].tweetId);
  }
}

const start = async function () {
  console.log("Bot started...");
  setInterval(async () => {
    loadLatest();
    await startProcessing();
  }, 1000 * 60 * interval);
};

start();
