import { Layout } from "@/components/SideMenu";
import { auth } from "@/lib/lucia";

import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Search from "@mui/icons-material/Search";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Tweet } from "../api/gettweets";
import { useTweetsStore } from "@/lib/store";
import TweetComponent from "@/components/Tweet";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export async function getServerSideProps({
  req,
  res,
}: GetServerSidePropsContext) {
  const authRequest = auth.handleRequest(req, res);
  const { user, session } = await authRequest.validateUser();

  if (!user || !session) {
    return {
      redirect: {
        destination: "/signin",
      },
    };
  }
  return {
    props: {
      user,
    },
  };
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Dashboard(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const [value, setValue] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const router = useRouter();

  const handleLogout = async () => {
    const response = await fetch("/api/logout", {
      method: "POST",
    });
    console.log(response);
    if (response.redirected) router.push(response.url);
    console.log(response);
  };
  return (
    <>
      <Head>
        <title>Dashboard | Trendyy</title>
      </Head>
      {/* <Container maxWidth={false}> */}
      <Box sx={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
        <SearchBar />
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          {tabs.map((tab) => (
            <Tab key={tab.name} label={tab.name} {...a11yProps(0)} />
          ))}
        </Tabs>

        {tabs.map((tab, index) => (
          <TabPanel key={tab.name} index={index} value={value}>
            {tab.component}
          </TabPanel>
        ))}

        <div>Hello from logged in page</div>
        <div>user {props.user.email} is logged in right now</div>

        <Button variant="contained" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      {/* </Container> */}
    </>
  );
}

Dashboard.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};

export const SearchBar = () => {
  const { addTweets, addWordCloud } = useTweetsStore();
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
    let response = await fetch("/api/gettweets", {
      method: "POST",
      body: JSON.stringify({ query }),
    });
    const tweets = (await response.json()) as {
      tweets: Tweet[];
      wordsInTweets: { text: string; value: number }[];
    };
    addTweets(tweets.tweets);
    addWordCloud(tweets.wordsInTweets);
    console.log(tweets.wordsInTweets);
  });

  return (
    <form onSubmit={onSubmit}>
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

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
      style={{
        paddingTop: "0.5rem",
      }}
    >
      {value === index && <>{children}</>}
    </div>
  );
}

const tabs = [
  {
    name: "Pie Chart",
    component: <CustomPie />,
  },
  {
    name: "Bar Chart",
    component: <CustomBar />,
  },
  {
    name: "All Tweets",
    component: <AllTweets />,
  },
];
const colors = ["#143059", "#2F6B9A", "#82a6c2"];

function CustomPie() {
  const analysisTweets = useTweetsStore((state) => state.analysisTweets);
  const words = useTweetsStore((state) => state.wordCloud);

  const fixedValueGenerator = () => 0.5;
  const positiveTweets = useMemo(() => {
    return analysisTweets.filter(
      (tweet) => tweet.models[0].prediction === "Positive"
    ).length;
  }, [analysisTweets]);
  const negativeTweets = useMemo(() => {
    return analysisTweets.filter(
      (tweet) => tweet.models[0].prediction === "Negative"
    ).length;
  }, [analysisTweets]);
  const neutralTweets = useMemo(() => {
    return analysisTweets.filter(
      (tweet) => tweet.models[0].prediction === "Neutral"
    ).length;
  }, [analysisTweets]);

  const data = [
    {
      name: "Positive" as const,
      value: positiveTweets,
    },
    {
      name: "Negative" as const,
      value: negativeTweets,
    },
    {
      name: "Neutral" as const,
      value: neutralTweets,
    },
  ];
  if (analysisTweets.length === 0) return null;
  return (
    // <VictoryPie
    //   theme={VictoryTheme.material}
    //   padding={{
    //     bottom: 100,
    //     left: 100,
    //     top: 100,
    //     right: 100,
    //   }}
    //   containerComponent={<VictoryContainer responsive={false} />}
    //   colorScale={["green", "black", "red"]}
    //   // animate={{
    //   //   duration: 1000,
    //   //   easing: "bounce",
    //   //   onLoad: {
    //   //     duration: 1000,
    //   //   },
    //   // }}
    //   labels={({ datum }) => `${datum.x} : ${datum.y} `}
    //   // labelComponent={<VictoryTooltip />}
    //   data={[
    //     { x: "Positive", y: positiveTweets },
    //     {
    //       x: "Neutral",
    //       y: NeutralTweets,
    //     },
    //     {
    //       x: "Negative",
    //       y: NegativeTweets,
    //     },
    //   ]}
    // />
    <>
      <PieChart width={500} height={500}>
        <Tooltip />
        <Legend verticalAlign="top" height={36} />

        <Pie data={data} dataKey="value" nameKey="name">
          {data.map((entry, index) => (
            <Cell
              key={`Cell ${index}`}
              fill={
                entry.name === "Positive"
                  ? "#10ba5d"
                  : entry.name === "Negative"
                  ? "#fb586e"
                  : "#feac02"
              }
            />
          ))}
        </Pie>
      </PieChart>
      <Typography>
        Overall Sentiment{" "}
        {positiveTweets > neutralTweets
          ? positiveTweets > negativeTweets
            ? "Positive"
            : "Negative"
          : "Neutral"}
      </Typography>
      {/* <Box flex={1} flexDirection="column" sx={{ userSelect: "none" }}>
        <Wordcloud
          words={words}
          height={500}
          width={600}
          // fontSize={fontSizeSetter}
          font={"Impact"}
          padding={2}
          random={fixedValueGenerator}
          spiral="archimedean"
        >
          {(words) =>
            words.map((w, i) => (
              <Text
                fill={colors[i % colors.length]}
                key={w.text}
                textAnchor="middle"
                transform={`translate(${w.x}),${w.y}) rotate(${w.rotate})`}
                fontSize={w.size}
                fontFamily={w.font}
              >
                {w.text}
              </Text>
            ))
          }
        </Wordcloud>
      </Box> */}
    </>
  );
}

function CustomBar() {
  const analysisTweets = useTweetsStore((state) => state.analysisTweets);

  const positiveTweets = useMemo(() => {
    return analysisTweets.filter(
      (tweet) => tweet.models[0].prediction === "Positive"
    ).length;
  }, [analysisTweets]);
  const negativeTweets = useMemo(() => {
    return analysisTweets.filter(
      (tweet) => tweet.models[0].prediction === "Negative"
    ).length;
  }, [analysisTweets]);
  const neutralTweets = useMemo(() => {
    return analysisTweets.filter(
      (tweet) => tweet.models[0].prediction === "Neutral"
    ).length;
  }, [analysisTweets]);

  const data = [
    {
      positive: positiveTweets,

      negative: negativeTweets,

      neutral: neutralTweets,
    },
  ];

  return (
    <>
      {analysisTweets.length !== 0 && (
        <BarChart width={750} height={500} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 50]} tickCount={5} />
          <Tooltip />
          <Legend />

          <Bar dataKey="positive" fill="#10ba5d" />
          <Bar dataKey="negative" fill="#fb586e" />
          <Bar dataKey="neutral" fill="#feac02" />
        </BarChart>
      )}
    </>
  );
}

function AllTweets() {
  const { analysisTweets } = useTweetsStore();
  return (
    <div>
      {analysisTweets.length === 0 ? (
        <div>No Tweets</div>
      ) : (
        <List style={{ maxHeight: "100%", overflow: "auto" }}>
          {analysisTweets.map((tweet) => (
            <TweetComponent key={tweet.id} {...tweet} />
          ))}
        </List>
      )}
    </div>
  );
}
