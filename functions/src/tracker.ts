import * as functions from "firebase-functions";
import axios from "axios";

const configSecret = functions.config();

const rebrandlyKey = configSecret.rebrandly.key;
const rebrandlyId = configSecret.rebrandly.id;
axios.defaults.baseURL = "https://api.rebrandly.com/";

const bestKey = (url: string): string => {
  if (url.includes("twitter.com/hashtag/")) {
    return `H_${url.split("/").pop()}`;
  }
  if (url.includes("twitter.com/")) {
    return url.split("/").pop() || url;
  }
  if (url.includes("/") && url.indexOf("/") < (url.length - 1)) {
    return url.split("/").pop() || url;
  }
  return url;
};

const config = {
  headers: {
    "Content-Type": "application/json",
    "apikey": rebrandlyKey,
    "workspace": rebrandlyId,
  },
};

export const shortURLPixel = (url: string): Promise<string> => new Promise((resolve) => {
  const key = bestKey(url);
  axios.post("/v1/links", {
    destination: url,
    domain: {fullName: "imf.to"},
    // , slashtag: "A_NEW_SLASHTAG"
    // , title: "Rebrandly YouTube channel"
  }, config)
      .then((response) => {
        if (response && response.data && response.data.shortUrl) {
          console.log("new link", response.data);
          resolve(response.data.shortUrl);
        } else {
          console.error("shorten error, no shorten found", response);
          resolve(url);
        }
      })
      .catch((error) => {
        if (error.response.data.error_message === "Key already taken for this domain") {
          resolve(`https://imf.to/${key}`);
        } else {
          console.error("shorten error", error.response.data, error);
          resolve(url);
        }
      });
});
