"use client";
import { Amplify } from "aws-amplify";
import { useEffect } from "react";

function parseRedirects(value: string | undefined, fallback: string): string[] {
  const parsed = (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return parsed.length > 0 ? parsed : [fallback];
}

const redirectSignIn = parseRedirects(
  process.env.NEXT_PUBLIC_REDIRECT_SIGN_IN,
  "http://localhost:3000/auth/callback"
);
const redirectSignOut = parseRedirects(
  process.env.NEXT_PUBLIC_REDIRECT_SIGN_OUT,
  "http://localhost:3000/"
);

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
      loginWith: {
        oauth: {
          domain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN!,
          scopes: ["email", "openid", "profile"],
          redirectSignIn,
          redirectSignOut,
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
    const hasMatchingRedirect = redirectSignIn.some((url) =>
      url.startsWith(currentOrigin)
    );

    if (!hasMatchingRedirect) {
      console.warn(
        `Amplify Redirect Mismatch: Configured redirects are ${redirectSignIn.join(
          ", "
        )} but currently on ${currentOrigin}. OAuth might fail.`
      );
    }
  }, []);

  return <>{children}</>;
}
