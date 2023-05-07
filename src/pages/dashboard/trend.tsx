import { Layout } from "@/components/SideMenu";

import { useState, useEffect } from "react";
import { Tweet } from "../api/gettweets";
import {
  Label,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useTweetsStore } from "@/lib/store";
import { Search } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import Head from "next/head";

export default function Trends() {
  const {
    intervalId,
    setIntervalId,
    realTimeData: data,
    addRealTimeData: setData,
    clearRealTimeData,
  } = useTweetsStore();
  const query = useTweetsStore((state) => state.realTimeQuery);

  // const [data, setData] = useState<
  //   { positive: number; negative: number; neutral: number }[]
  // >([]);

  const getTweetSentiment = async () => {
    const tweets = await fetch("/api/realtime", {
      method: "POST",
      body: JSON.stringify({ query: query }),
    });
    const response = (await tweets.json()) as {
      tweets: Tweet[];
      wordsInTweets: { text: string; value: number }[];
    };
    const positiveTweets = response.tweets.filter(
      (tweet) => tweet.models[0].prediction === "Positive"
    ).length;
    const negativeTweets = response.tweets.filter(
      (tweet) => tweet.models[0].prediction === "Negative"
    ).length;
    const neutralTweets = response.tweets.filter(
      (tweet) => tweet.models[0].prediction === "Neutral"
    ).length;

    setData({
      positive: positiveTweets,
      neutral: neutralTweets,
      negative: negativeTweets,
    });
  };

  const startInterval = () => {
    const intervalId = window.setInterval(() => {
      getTweetSentiment();
    }, 10000);
    setIntervalId(intervalId);
  };

  const stopInterval = () => {
    window.clearInterval(intervalId);
    setIntervalId(undefined);
  };

  const handleClick = () => {
    if (intervalId) {
      stopInterval();
    } else {
      startInterval();
    }
  };

  useEffect(() => {
    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Dashboard | Realtime Trend</title>
      </Head>
      <Box>
        <SearchBar />
        <Box flex={1} flexDirection="row">
          <Button
            sx={{ marginBottom: "1rem", marginRight: "0.5rem" }}
            variant="contained"
            onClick={handleClick}
          >
            {intervalId ? "Stop" : "Start"}
          </Button>
          <Button
            disabled={!!intervalId}
            sx={{ marginBottom: "1rem" }}
            variant="contained"
            onClick={() => clearRealTimeData()}
          >
            Clear Graph
          </Button>
        </Box>

        {!!data.length && (
          <>
            <LineChart width={800} height={400} data={data}>
              <XAxis
                tick
                tickFormatter={(value, index) => `${index * 10}`}
                dataKey="name"
              />
              <YAxis domain={[0, 20]} tickCount={5} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="positive" stroke="#10ba5d" />
              <Line type="monotone" dataKey="negative" stroke="#fb586e" />
              <Line type="monotone" dataKey="neutral" stroke="#feac02" />
            </LineChart>
            <Typography> Current Query {query}</Typography>
          </>
        )}
      </Box>
    </>
  );
}

Trends.getLayout = function getLayout(page: JSX.Element) {
  return <Layout>{page}</Layout>;
};

const SearchBar = () => {
  const { addRealTimeQuery } = useTweetsStore();
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
    addRealTimeQuery(query);
  });

  return (
    <form style={{ paddingBottom: "1rem" }} onSubmit={onSubmit}>
      <Controller
        name="query"
        control={control}
        render={({ field }) => (
          <>
            <TextField
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
                <CircularProgress size="40" />
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
