import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import StarIcon from "@mui/icons-material/StarBorder";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "@/components/Link";
import Container from "@mui/material/Container";
import { auth } from "@/lib/lucia";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import Image from "next/image";

export async function getServerSideProps({
  req,
  res,
}: GetServerSidePropsContext) {
  const authRequest = auth.handleRequest(req, res);
  const { user } = await authRequest.validateUser();

  return {
    props: {
      user,
    },
  };
}

export default function HomePage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  return (
    <div style={{ minWidth: "100%", height: "100%" }}>
      <Head>
        <title>Trendyy | Analyze your market</title>
      </Head>
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
      >
        <Toolbar sx={{ flexWrap: "wrap" }}>
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            Trendyy
          </Typography>

          {props.user ? (
            <>
              <Typography
                component="p"
                variant="h6"
                fontStyle="normal"
                align="center"
                color="text.primary"
              >
                Logged in as {props.user.email}
              </Typography>
              <Button variant="outlined" sx={{ mx: 1, my: 1 }}>
                <Link
                  href="/dashboard"
                  variant="button"
                  sx={{ textDecoration: "none" }}
                >
                  Go to Dashboard
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="outlined" sx={{ my: 1, mx: 1 }}>
                <Link
                  sx={{ textDecoration: "none" }}
                  variant="button"
                  href="/signin"
                >
                  LOGIN
                </Link>
              </Button>
              <Button variant="outlined" sx={{ my: 1, mx: 1 }}>
                <Link
                  sx={{ textDecoration: "none" }}
                  variant="button"
                  href="/signup"
                >
                  SIGN UP
                </Link>
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <img
        style={{
          position: "absolute",
          height: "91.3%",
          overflow: "auto",
        }}
        src="https://images.unsplash.com/photo-1605778336817-121ba9819b96?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&dl=christian-lue-ONXinOMPpCc-unsplash.jpg&w=1920"
        width={"100%"}
      />
      <Container
        disableGutters
        maxWidth="sm"
        component="main"
        sx={{ pt: 8, pb: 6, position: "relative" }}
      >
        <Typography
          component="h1"
          variant="h2"
          align="center"
          sx={{
            color: "white",
            fontWeight: "bold",
            letterSpacing: "0.25rem",
            textShadow: "4px 4px 1px black",
          }}
          gutterBottom
        >
          Analyze Trends
        </Typography>
        <Typography
          component="h1"
          variant="h2"
          align="center"
          sx={{
            color: "white",
            fontWeight: "bold",
            letterSpacing: "0.25rem",
            textShadow: "4px 4px 1px black",
          }}
          gutterBottom
        >
          And Predict Your Market
        </Typography>
        <Typography
          component="h1"
          variant="h2"
          align="center"
          sx={{
            color: "white",
            fontWeight: "bold",
            letterSpacing: "0.25rem",
            textShadow: "4px 4px 1px black",
          }}
          gutterBottom
        >
          On Twitter
        </Typography>
        <Typography
          variant="h5"
          align="center"
          color="text.secondary"
          component="p"
          sx={{
            color: "white",
            letterSpacing: "0.15rem",
            textShadow: "2px 2px 1px black",
          }}
        >
          Quickly figure out what other people are saying about your brand on
          twitter
        </Typography>
      </Container>
    </div>
  );
}
