"use client";
import { Amplify } from "aws-amplify";
import { useEffect } from "react";

const redirectSignIn = process.env.NEXT_PUBLIC_REDIRECT_SIGN_IN!;

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
      loginWith: {
        oauth: {
          domain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN!,
          scopes: ["email", "openid", "profile"],
          redirectSignIn: [redirectSignIn],
          redirectSignOut: [process.env.NEXT_PUBLIC_REDIRECT_SIGN_OUT!],
          responseType: "code",
        },
      },
    },
  },
});

export default function AmplifyProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const currentOrigin = window.location.origin;
    if (redirectSignIn && !redirectSignIn.startsWith(currentOrigin)) {
      console.warn(
        `Amplify Redirect Mismatch: Configured to ${redirectSignIn} but currently on ${currentOrigin}. OAuth might fail or redirect to wrong host.`
      );
    }
  }, []);

  return <>{children}</>;
}
