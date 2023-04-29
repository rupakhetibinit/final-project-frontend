import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useRouter } from "next/router";
import { auth } from "@/lib/lucia";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";

export async function getServerSideProps({
  req,
  res,
}: GetServerSidePropsContext) {
  const authRequest = auth.handleRequest(req, res);
  const { user, session } = await authRequest.validateUser();

  if (user || session) {
    return {
      redirect: {
        destination: "/dashboard",
        permananet: false,
      },
    };
  }
  return {
    props: {
      user,
    },
  };
}
const theme = createTheme();

export default function SignIn() {
  const router = useRouter();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email")?.toString();
    const password = data.get("password")?.toString();
    console.log(email, password);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
    if (email?.includes("@") && password && password.length >= 8) {
      const response = await fetch("/api/signin", {
        method: "POST",
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      console.log(response);

      if (response.redirected) router.push("/dashboard");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>Trendyy | Sign In</title>
      </Head>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login to your Trendyy Account
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            {/* <FormControlLabel
							control={<Checkbox value='remember' color='primary' />}
							label='Remember me'
						/> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container justifyContent="center">
              {/* <Grid item xs>
								<Link href='#' variant='body2'>
									Forgot password?
								</Link>
							</Grid> */}
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
