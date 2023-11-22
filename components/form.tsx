// components/form.tsx
"use client";

import { useRouter } from "next/navigation";

// This component is designed to be used by the app/api/logout/route.ts.
// When the user clicks logout, the app is redirected to the route above which use this component.
// The component needs to be executed in frontend to terminate the user session and refresh the entire app.

const Form = ({
	children,
	action
}: {
	children: React.ReactNode;
	action: string;
}) => {
	const router = useRouter();
	return (
		<form
			action={action}
			method="post"
			onSubmit={async (e) => {
				e.preventDefault();
				const formData = new FormData(e.currentTarget);
				const response = await fetch(action, {
					method: "POST",
					body: formData,
					redirect: "manual"
				});

				if (response.status === 0) {
					// redirected
					// when using `redirect: "manual"`, response status 0 is returned
					return router.refresh();
				}
			}}
		>
			{children}
		</form>
	);
};

export default Form;
