import { Tweet } from "@/pages/api/gettweets";
import { create } from "zustand";

export interface TweetsState {
  analysisTweets: Tweet[];
  addTweets: (tweets: Tweet[]) => void;
  wordCloud: { text: string; value: number }[];
  addWordCloud: (words: { text: string; value: number }[]) => void;
}

const useTweetsStore = create<TweetsState>()((set) => ({
  analysisTweets: [],
  addTweets: (tweets) => set(() => ({ analysisTweets: tweets })),
  wordCloud: [],
  addWordCloud: (words) => set(() => ({ wordCloud: words })),
}));

export { useTweetsStore };
