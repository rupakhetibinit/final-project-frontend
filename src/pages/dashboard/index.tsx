import { auth } from "@/lib/lucia";
import { Box, Container } from "@mui/material";
import Button from "@mui/material/Button";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

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

export default function Dashboard(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const router = useRouter();
  const handleLogout = async () => {
    const response = await fetch("/api/logout", {
      method: "POST",
    });
    if (response.redirected) router.push(response.url);
    console.log(response);
  };
  return (
    <>
      <Head>
        <title>Dashboard | Trendyy</title>
      </Head>
      <Container maxWidth={false}>
        <Box sx={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
          <div>Hello from logged in page</div>
          <div>user {props.user.email} is logged in right now</div>
          <Button variant="contained" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Container>
    </>
  );
}
