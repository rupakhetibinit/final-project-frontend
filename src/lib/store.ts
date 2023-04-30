import { Tweet } from "@/pages/api/gettweets";
import { TweetV2 } from "twitter-api-v2";
import { create } from "zustand";

export interface TweetsState {
  analysisTweets: Tweet[];
  addTweets: (tweets: Tweet[]) => void;
  wordCloud: { text: string; value: number }[];
  addWordCloud: (words: { text: string; value: number }[]) => void;
  realTimeQuery: string;
  addRealTimeQuery: (query: string) => void;
  realTimeData: { positive: number; negative: number; neutral: number }[];
  addRealTimeData: (data: {
    positive: number;
    negative: number;
    neutral: number;
  }) => void;
  intervalId: number | undefined;
  setIntervalId: (id: number | undefined) => void;
  clearRealTimeData: () => void;
  weeklyTweets: {
    day: string;
    tweet: {
      original: TweetV2;
      response: Tweet;
    }[];
    sentiment: {
      positive: number;
      negative: number;
      neutral: number;
    };
  }[];
  addWeeklyTweets: (
    weeklyTweets: {
      day: string;
      tweet: {
        original: TweetV2;
        response: Tweet;
      }[];
      sentiment: {
        positive: number;
        negative: number;
        neutral: number;
      };
    }[]
  ) => void;
  weeklyQuery: string;
  addWeeklyQuery: (weeklyQuery: string) => void;
}

const useTweetsStore = create<TweetsState>()((set) => ({
  analysisTweets: [],
  addTweets: (tweets) => set(() => ({ analysisTweets: tweets })),
  wordCloud: [],
  addWordCloud: (words) => set(() => ({ wordCloud: words })),
  realTimeQuery: "",
  addRealTimeQuery: (query) => set(() => ({ realTimeQuery: query })),
  realTimeData: [],
  addRealTimeData: (data: {
    positive: number;
    negative: number;
    neutral: number;
  }) => set((state) => ({ realTimeData: [...state.realTimeData, data] })),
  intervalId: undefined,
  setIntervalId: (id) => set(() => ({ intervalId: id })),
  clearRealTimeData: () => set(() => ({ realTimeData: [] })),
  weeklyTweets: [],
  addWeeklyTweets: (weeklyTweets) =>
    set(() => ({ weeklyTweets: weeklyTweets })),
  weeklyQuery: "",
  addWeeklyQuery: (weeklyQuery) => set(() => ({ weeklyQuery: weeklyQuery })),
}));

export { useTweetsStore };

export type TweetV2Required = Required<
  Pick<TweetV2, "lang" | "id" | "created_at" | "text">
>;
