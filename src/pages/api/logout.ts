import type { NextApiRequest, NextApiResponse } from "next";
import { auth } from "@/lib/lucia";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("this is called");
  if (req.method !== "POST")
    return res.status(404).json({ error: "Not found" });

  const authRequest = auth.handleRequest(req, res);
  try {
    const session = await authRequest.validate();
    if (session) {
      auth.invalidateSession(session?.sessionId);
      authRequest.setSession(null);
      return res.redirect("/");
    }
    return res
      .status(400)
      .json({ error: "Cannot logout right now, try again later" });
  } catch (error) {
    // invalid
    console.log(error);
    return res.status(400).json({
      error: "Incorrect username or password",
    });
  }
}
