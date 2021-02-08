/* eslint-disable */
import * as functions from 'firebase-functions'
import axios from 'axios'
const Twitter = require('twitter')

// PixelMeApiToken
const configSecret = functions.config()
const TwitterApiToken = {
  consumer_key: configSecret.twitter.consumer_key,
  consumer_secret: configSecret.twitter.consumer_secret,
  access_token_key: configSecret.twitter.access_token_key,
  access_token_secret: configSecret.twitter.access_token_secret
}
const client = new Twitter(TwitterApiToken)
const urlMetadata = require('url-metadata')

interface IndieHackerUser {
  bio: string
  city: string
  country: string
  createdAt: number
  fullName: string
  objectID: string
  publicEmail: string
  region: string
  twitterHandle: string
  username: string
}

interface LeChantierUser {
  id: string
  bio: string
  avatar: string
  karma: number
  revenue: number
  username: string
  linkedin?: string
  twitter?: string
  website?: string
  youtube?: string
}
interface UserUpdate {
  uid: string,
  createdAt: string,
  url: string,
  image: string,
  title: string,
  description: string,
  links: string[],
  meta: {key: string, data: string}[]
  tags: string[]
}

const IHApi = 'https://n86t1r3owz-2.algolianet.com/1/indexes/*/queries'
const IHheaders = {
    "headers": {
      "x-algolia-agent": "Algolia for JavaScript (3.35.1); Browser (lite)",
      "x-algolia-application-id": "N86T1R3OWZ",
      "x-algolia-api-key": "5140dac5e87f47346abbda1a34ee70c3"
    }
}

const getIndieHackersUserData: Promise<UserUpdate[]> = async (IHName: string) => {
  const formData = {
    "requests":[
      {
        "indexName":"posts_createdTimestamp_desc",
        "params":`query=&page=0&hitsPerPage=10&facetFilters=%5B%22username%3A${IHName}%22%2C%22isFeatured%3Atrue%22%5D`}
      ]
    }
  const posts: UserUpdate[] = []
  try {
    const res = await axios.post(IHApi, formData, IHheaders)
    const hits = res.data.results[0].hits;
    hits.forEach((element) => {
      posts.push({
        uid: element.postID,
        createdAt: new Date(element.createdTimestamp).toUTCString(),
        url: `https://www.indiehackers.com/post/${element.url}`,
        image: '',
        title: element.title,
        meta: [
          {key: 'views', data: element.numViews},
          {key: 'replies', data: element.numReplies},
          {key: 'likes', data: element.numLinkClicks},
        ],
        description: element.body,
        links: getUrls(element.body),
        tags: getHashTags(element.body)
      })
    });
    return posts
  } catch (err) {
    return posts
  }
}

const getIndieHackersUser: Promise<IndieHackerUser> = async (twiterName: string) => {
  const formData = {
    "requests":[
      {
        "indexName":"users",
        "params":`query=${twiterName}&page=0&hitsPerPage=6&restrictSearchableAttributes=%5B%22bio%22%2C%22city%22%2C%22region%22%2C%22country%22%2C%22fullName%22%2C%22username%22%5D&highlightPreTag=%3Cem%20class%3D%22query-match%22%3E`
      }
    ]
  }
  try {
    const res = await axios.post(IHApi, formData, IHheaders)
    return <IndieHackerUser>res.data.results[0].hits[0]
  } catch (err) {
    return null
  }
}

const tweetsPromise = (screen_name: string): Promise<UserUpdate[]> => {
  return new Promise((resolve, reject) => {
    const params = {"tweet.fields": "created_at,public_metrics"}
    client.get(`2/users/${screen_name}/tweets`, params, async (error: any, tweets: any[], response: any) => {
      if (!error && tweets) {
        console.log('tweets', tweets, 'response', response)
        const posts: UserUpdate[] = []
        try {
          tweets.forEach((element) => {
            posts.push({
              uid: element.id,
              createdAt: element.created_at,
              url: `https://twitter.com/${screen_name}/status/${element.conversation_id}`,
              image: '',
              title: 'Tweet',
              meta: [
                {key: 'retweet', data: element.public_metrics.retweet_count},
                {key: 'replies', data: element.public_metrics.reply_count},
                {key: 'likes', data: element.public_metrics.like_count},
              ],
              description: element.text,
              links: getUrls(element.text),
              tags: getHashTags(element.text)
            })
          });
        } catch (err) {
          console.error(err);
        }
        resolve(posts)
      } else {
        console.error('Cannot find tweets', error, response)
        reject(error)
      }
    })
  })
}

const getLeChantier = async (twiterName: string) => {
  const chantierApi = `https://lechantier.co/_next/data/PuVoQzwQlcJMi5AZhA8Tq/users/${twiterName}.json`
  try {
    const res = await axios.get(chantierApi);
    const data = res.data.pageProps.initialApolloState;
    const posts: UserUpdate[] = [];

    const projKeys = Object.keys(data).filter((elem) => {
      return elem.startsWith("Project")
    });
    const postKeys = Object.keys(data).filter((elem) => {
      return elem.startsWith("Post")
    });
    const uKeys = Object.keys(data).filter((elem) => {
      return elem.startsWith("User")
    });
    const user: LeChantierUser = data[uKeys[0]]
    projKeys.forEach((element) => {
      const project = data[element];
      posts.push({
        uid: project.slug,
        url: `https://lechantier.co/projects/${project.slug}`,
        createdAt: '',
        image: project.logo,
        title: project.name,
        meta: [
          {key: 'revenue', data: project.revenue},
        ],
        description: project.description,
        links: [project.url],
        tags: getHashTags(project.description)
      })
    });
    postKeys.forEach((element) => {
      const post = data[element];
      posts.push({
        uid: post.slug,
        url: `https://lechantier.co/projects/${project.slug}`,
        createdAt: post.createdAt,
        image: '',
        title: 'Post Le chantier',
        description: post.title,
        meta: [
          {key: 'votes', data: post.votes.length},
        ],
        links: [],
        tags: []
      })
    });
    return {
      user,
      posts
    }
  } catch (err) {
    return []
  }
}

const getHashTags = (inputText) => {
  if (!inputText) return [];
  var regex = /(?:^|\s)(?:#)([a-zA-Z\d]+)/gm;
  var matches: string[] = [];
  var match;

  while ((match = regex.exec(inputText))) {
      matches.push(match[1]);
  }

  return matches;
}

const getUrls = (inputText) => {
  if (!inputText) return [];
  const regex = /\bhttps?:\/\/\S+/gi;
  var matches: string[] = [];
  var match;

  while ((match = regex.exec(inputText))) {
      matches.push(match[1]);
  }
  return matches;
}

const getMetaFromUrl = async (url) => {
  try {
    const meta = await urlMetadata(url);
    return {
      uid: meta['canonical'],
      createdAt: '',
      url: meta['og:url'],
      image: meta['og:image'],
      title: meta['og:title'],
      description: meta['og:description'],
      links: [],
      meta: [],
      tags: (meta['keywords'] || '').split(',')
    };
  } catch (err) {
    console.error(err);
    return null;
  }
}
