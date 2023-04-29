/// <reference types="lucia-auth" />
declare namespace Lucia {
	type Auth = import('@/lib/lucia.ts').Auth;
	type UserAttributes = {
		email: string;
		firstName: string;
		lastName: string;
	};
}
