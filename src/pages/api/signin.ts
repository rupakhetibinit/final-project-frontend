import type { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '@/lib/lucia';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	console.log('this is called');
	if (req.method !== 'POST')
		return res.status(404).json({ error: 'Not found' });
	console.log(req.body);
	const { email, password } = JSON.parse(req.body);
	console.log(email, password);
	if (typeof email !== 'string' || typeof password !== 'string')
		return res.status(400).json({});
	//@ts-ignore
	const authRequest = auth.handleRequest(req, res);
	try {
		const key = await auth.useKey('email', email, password);
		const session = await auth.createSession(key.userId);
		console.log(key);
		console.log(session);
		console.log(session);

		authRequest.setSession(session); // set cookie
		return res.redirect(302, '/dashboard'); // redirect to profile page
	} catch (error) {
		// invalid
		console.log(error);
		return res.status(400).json({
			error: 'Incorrect username or password',
		});
	}
}
