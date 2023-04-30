import { Layout } from "@/components/SideMenu";
import { TweetV2Required, useTweetsStore } from "@/lib/store";
import Search from "@mui/icons-material/Search";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import { Controller, useForm } from "react-hook-form";
import { Tweet } from "../api/gettweets";
import { Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { Typography } from "@mui/material";
import dayjs from "dayjs";
import { TweetV2 } from "twitter-api-v2";
import Head from "next/head";

export interface Dates {
  [key: string]: {
    original: TweetV2;
    response: Tweet;
  }[];
}

export default function Weekly() {
  const weeklyTweets = useTweetsStore((state) => state.weeklyTweets);
  const weeklyQuery = useTweetsStore((state) => state.weeklyQuery);

  // console.log(dates);
  return (
    <div>
      <Head>
        <title>Dashboard | Weekly Trends</title>
      </Head>
      <SearchBar />
      {!!weeklyTweets.length && (
        <>
          <LineChart width={800} height={400} data={weeklyTweets}>
            <XAxis dataKey="day" />
            <YAxis domain={[0, 10]} tickCount={6} />
            <Tooltip labelFormatter={(label) => <div>{label}</div>} />
            <Legend />

            <Line
              type="monotone"
              dataKey={"sentiment.positive"}
              label="Positive"
              stroke="#10ba5d"
            />
            <Line
              type="monotone"
              dataKey="sentiment.negative"
              label="Negative"
              stroke="#fb586e"
            />
            <Line
              type="monotone"
              dataKey="sentiment.neutral"
              label="Neutral"
              stroke="#feac02"
            />
          </LineChart>
          <Typography> Current Query {weeklyQuery}</Typography>
        </>
      )}
    </div>
  );
}

Weekly.getLayout = function getLayout(page: JSX.Element) {
  return <Layout>{page}</Layout>;
};

const SearchBar = () => {
  const addWeeklyTweets = useTweetsStore((state) => state.addWeeklyTweets);
  const addWeeklyQuery = useTweetsStore((state) => state.addWeeklyQuery);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      query: "",
    },
  });
  const onSubmit = handleSubmit(async ({ query }) => {
    if (query.length == 0) return;
    const response = await fetch("/api/week", {
      method: "POST",
      body: JSON.stringify({ query: query }),
    });
    const res: {
      tweets: {
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
    } = await response.json();
    // console.log(res.tweets);
    addWeeklyTweets(res.tweets);
    addWeeklyQuery(query);
  });

  return (
    <form style={{ paddingBottom: "1rem" }} onSubmit={onSubmit}>
      <Controller
        name="query"
        control={control}
        render={({ field }) => (
          <>
            <TextField
              disabled={isSubmitting}
              id="search-bar"
              className="text"
              label="Analyze a keyword"
              variant="outlined"
              placeholder="Search..."
              size="small"
              {...field}
              sx={{
                width: "24rem",
                paddingX: "0.25rem",
              }}
            />
            <IconButton type="submit" aria-label="search">
              {isSubmitting ? (
                <CircularProgress color="primary" size="40" />
              ) : (
                <Search style={{ fill: "blue" }} />
              )}
            </IconButton>
          </>
        )}
      />
    </form>
  );
};
