import { countWordsInTweets } from "@/lib/preprocess";
import { NextApiRequest, NextApiResponse } from "next";
import { start } from "repl";
import { TwitterApi } from "twitter-api-v2";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return null;
  }

  const twitterClient = new TwitterApi({
    appKey: process.env.APP_KEY as string,
    appSecret: process.env.APP_SECRET as string,
    accessToken: process.env.ACCESS_TOKEN as string,
    accessSecret: process.env.ACCESS_SECRET as string,
  });

  twitterClient.readOnly;

  //   const tweets = await twitterClient.v2.search("iphone", {
  //     "tweet.fields": ["lang"],
  //     max_results: 10,

  //   });

  // const tw = await twitterClient.v2.search({
  //   query: "iphone",
  //   max_results: 50,
  //   "tweet.fields": ["lang"],
  // });

  // const today = new Date();
  // today.setDate(today.getDate() - 7);
  // for (let i = 0; i < 7; i++) {
  //   const startDate = today.toISOString();
  //   const endDate = today.toISOString();
  //   const sinceDate = new Date(today);
  //   sinceDate.setDate(sinceDate.getDate() + i);
  //   const twit = await twitterClient.v2.search({
  //     query: "iphone",
  //     max_results: 10,
  //     start_time: startDate,
  //     end_time: endDate,
  //   });
  //   twit.data.data.map((tweet) => console.log(tweet));
  // }

  const { query } = JSON.parse(req.body);
  const tweets = await twitterClient.v2.get(
    `tweets/search/recent?max_results=51&query=` +
      query +
      " -is:retweet -has:links -has:mentions lang:en"
  );

  //   tweets.data.data.map((tweet) => {
  //     console.log(tweet.text);
  //     console.log(tweet.lang);
  //   });
  //   return null;
  //   console.log(tweets);

  //   {
  //     "id": "1652325192528699392",
  //     "models": [
  //         {
  //             "model_id": 4,
  //             "name": "BERT Finetuned",
  //             "prediction": "Positive"
  //         }
  //     ],
  //     "tweet": "I lov u n your iphone 5"
  // },

  // const today = new Date();
  // const endDate = today.toISOString().slice(0, 10);
  // today.setDate(today.getDate() - 7);
  // const startDate = today.toISOString().slice(0, 10);
  // const getTweets = async (sinceId: number, query?: string) => {
  //   console.log(sinceId);
  //   const res = await twitterClient.v2.get(
  //     `tweets/search/recent?max_results=10&query=iphone&since_id=${sinceId}`
  //   );
  //   return res;
  // };
  // for (let i = 0; i < 7; i++) {
  //   const sinceDate = new Date(today);
  //   sinceDate.setDate(sinceDate.getDate() + i);
  //   const sinceId = Math.floor(sinceDate.getTime() * 1000000);
  //   const data = await getTweets(sinceId);
  //   console.log(data);
  // }

  try {
    let totalTweets: Tweet[] = [];
    await Promise.all(
      tweets.data.map(async (d: any) => {
        const response = await sentiment(JSON.stringify(d));
        totalTweets.push(response);
      })
    );
    // console.log(totalTweets);
    const wordsInTweets = countWordsInTweets(totalTweets);

    return res.json({ tweets: totalTweets, wordsInTweets: wordsInTweets });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Everything went wrong" });
  }
}

async function sentiment(i: string) {
  let response = await fetch("http://127.0.0.1:5000/test", {
    body: i,
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });
  const tweet = (await response.json()) as Tweet;
  return tweet;
}

export type Tweet = {
  id: string;
  tweet: string;
  models: {
    model_id: string;
    name: string;
    prediction: "Positive" | "Negative" | "Neutral";
  }[];
};
