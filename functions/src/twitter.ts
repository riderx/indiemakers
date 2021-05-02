import * as functions from "firebase-functions";
import * as Twitter from "twitter";

export interface TwUrl {
  url: string,
  expanded_url: string,
  display_url: string,
  indices: [
      number,
      number
  ]
}

export interface TwEntities {
  url: {
      hashtags: [],
      symbols: [],
      user_mentions: [],
      urls: TwUrl[]
  },
  description: {
      hashtags: [],
      symbols: [],
      user_mentions: [],
      urls: TwUrl[]
  },
}

export interface TwUser {
  created_at: string;
  default_profile_image: boolean;
  default_profile: boolean;
  description?: string | null;
  entities: TwEntities,
  favourites_count: number;
  followers_count: number;
  friends_count: number;
  id_str: string;
  id: number;
  listed_count: number;
  location?: string | null;
  name: string;
  profile_banner_url?: string;
  profile_image_url_https: string;
  protected: boolean;
  screen_name: string;
  statuses_count: number;
  url?: string | null;
  verified: boolean;
  withheld_in_countries?: string[];
  withheld_scope?: string;
}

// PixelMeApiToken
const configSecret = functions.config();
const TwitterApiToken = {
  consumer_key: configSecret.twitter.consumer_key,
  consumer_secret: configSecret.twitter.consumer_secret,
  access_token_key: configSecret.twitter.access_token_key,
  access_token_secret: configSecret.twitter.access_token_secret,
};
const client = new Twitter(TwitterApiToken);

export const twUserPromise = (screen_name: string): Promise<TwUser> => {
  return new Promise((resolve, reject) => {
    const params = {screen_name, include_entities: true};
    client.get("users/show", params, async (error: any, user: TwUser, response: any) => {
      if (!error && user) {
        console.log("User", user, "response", response);
        resolve(user);
      } else {
        console.error("Cannot find user", error, response);
        reject(error);
      }
    });
  });
};

export const getTwiterAccounts = (text: string) => {
  const list: Promise<TwUser>[] = [];
  const reTwitter = /^@?([a-zA-Z0-9_]){1,15}$/;
  text.replace(reTwitter, function(match, login) {
    list.push(twUserPromise(login));
    return login;
  });
  return Promise.all(list);
};
