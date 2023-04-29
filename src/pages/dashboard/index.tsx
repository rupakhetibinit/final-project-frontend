import { auth } from "@/lib/lucia";
import { GetServerSidePropsContext } from "next";

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

export default function Dashboard() {
  return <div>Hello</div>;
}
