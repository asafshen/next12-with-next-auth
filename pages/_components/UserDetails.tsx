import { useCallback } from 'react';
// import { useSession, useUser, useDescope } from '@descope/nextjs-sdk/client';
import Link from 'next/link';
import React from 'react';

const UserDetails = () => {
	// const { isAuthenticated, isSessionLoading } = useSession();
	// const { user } = useUser();
	// const sdk = useDescope();

	// const onLogout = useCallback(async () => {
	// 	await sdk.logout();
	// }, [sdk]);

	// if (isSessionLoading) return <div>Loading...</div>;

	return (
		<div>
			<h4>User Details</h4>
		</div>
	);
};

export default UserDetails;
