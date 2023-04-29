import type { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '@/lib/lucia';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== 'POST')
		return res.status(404).json({ error: 'Not found' });
	const { password, email, firstName, lastName } = JSON.parse(req.body);
	console.log(req.body);
	if (typeof email !== 'string' || typeof password !== 'string')
		return res.status(400).json({});

	const authRequest = auth.handleRequest(req, res);
	try {
		const user = await auth.createUser({
			primaryKey: {
				providerId: 'email',
				providerUserId: email,
				password,
			},
			
			attributes: {
				email,
				firstName,
				lastName,
			},
		});
		const session = await auth.createSession(user.userId);
		authRequest.setSession(session); // set cookies
		return res.redirect(302, '/dashboard'); // redirect user on account creations
	} catch (e) {
		console.log(e);
		return res.status(400).json({}); // invalid
	}
}
