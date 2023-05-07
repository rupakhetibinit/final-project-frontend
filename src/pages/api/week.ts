import { countWordsInTweets } from "@/lib/preprocess";
import dayjs from "dayjs";
import { NextApiRequest, NextApiResponse } from "next";

import { TweetV2, TwitterApi } from "twitter-api-v2";
import { Dates } from "../dashboard/weekly";

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
  const { query } = JSON.parse(req.body);
  const tweets: TweetV2[] = [];
  const now = new Date();
  const currentDate = dayjs(now);
  const lastWeek = currentDate.subtract(7, "days");
  // console.log(lastWeek);
  // console.log(dayjs(lastWeek));

  try {
    for (let i = 0; i < 7; ++i) {
      const dayBefore = lastWeek.add(i, "day").toISOString();
      const dayAfter = lastWeek.add(i + 1, "day").toISOString();
      if (currentDate.diff(dayjs(dayAfter)) < 0) {
        return;
      }
      console.log(`${i}th iteration & the dates are ${dayBefore} ${dayAfter}`);
      const twit = await twitterClient.v2.search({
        query: query + " -is:retweet -has:links -has:mentions lang:en",
        max_results: 15,
        start_time: dayBefore,
        end_time: dayAfter,
        "tweet.fields": ["lang", "geo", "created_at"],
      });
      twit.data.data.map((tweet) => {
        tweets.push(tweet);
        //   console.log(tweet);
      });
    }
  } catch (error) {
  } finally {
    try {
      let totalTweets: { original: TweetV2; response: Tweet }[] = [];
      await Promise.all(
        tweets.map(async (d) => {
          const response = await sentiment(JSON.stringify(d));
          totalTweets.push({ original: d, response: response });
        })
      );
      // console.log(totalTweets);
      //   const wordsInTweets = countWordsInTweets(totalTweets);

      const dates: Dates = {};
      totalTweets.forEach((tweet) => {
        const date = dayjs(tweet.original.created_at).format("YY-MMM-DD");
        if (dates[date]) {
          dates[date].push(tweet);
        } else {
          dates[date] = [tweet];
        }
      });

      const dayWiseData: {
        day: string;
        tweet: {
          original: TweetV2;
          response: Tweet;
        }[];
        sentiment: { positive: number; negative: number; neutral: number };
      }[] = [];

      // Iterate over the groups and create the day-wise tweet data
      for (const date in dates) {
        const tweetData = dates[date];
        const positiveTweets = tweetData.filter(
          (tweet) => tweet.response.models[0].prediction === "Positive"
        );
        const negativeTweets = tweetData.filter(
          (tweet) => tweet.response.models[0].prediction === "Negative"
        );
        const neutralTweets = tweetData.filter(
          (tweet) => tweet.response.models[0].prediction === "Neutral"
        );
        const dayData = {
          day: date,
          tweet: tweetData,
          sentiment: {
            positive: positiveTweets.length,
            negative: negativeTweets.length,
            neutral: neutralTweets.length,
          },
        };
        dayWiseData.push(dayData);
      }
      return res.json({ tweets: dayWiseData });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Everything went wrong" });
    }
  }

  //   const { query } = JSON.parse(req.body);
  //   const tweets = await twitterClient.v2.get(
  //     `tweets/search/recent?max_results=10&query=` +
  //       query +
  //       " -is:retweet -has:links -has:mentions lang:en"
  //   );

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

  //   try {
  //     let totalTweets: Tweet[] = [];
  //     await Promise.all(
  //       tweets.data.map(async (d: any) => {
  //         const response = await sentiment(JSON.stringify(d));
  //         totalTweets.push(response);
  //       })
  //     );
  //     console.log(totalTweets);
  //     const wordsInTweets = countWordsInTweets(totalTweets);

  //     return res.json({ tweets: totalTweets, wordsInTweets: wordsInTweets });
  //   } catch (error) {
  //     console.log(error);
  //     return res.status(500).json({ error: "Everything went wrong" });
  //   }
}

// type TweetResponse = Required<Pick<TweetV2, "text" | "created_at" | "lang">>;

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
