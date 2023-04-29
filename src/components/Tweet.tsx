import { Tweet } from "@/pages/api/gettweets";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
export default function TweetComponent(tweet: Tweet) {
  return (
    <ListItem>
      {tweet.tweet}
      {tweet.models[0].prediction}
    </ListItem>
  );
}
