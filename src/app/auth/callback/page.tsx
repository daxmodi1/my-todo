"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Completing sign-in…");

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    console.log("AuthCallbackPage mounted, setting up Hub listener...");

    // Listen for Amplify auth events (handles the OAuth code exchange)
    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      console.log("Hub auth event received:", payload.event, payload);
      if (payload.event === "signedIn") {
        console.log("User signed in, redirecting to /todo");
        setIsLoggedIn(true);
        router.replace("/todo");
      }
      if (payload.event === "signInWithRedirect_failure") {
        console.error("Sign-in with redirect failure:", payload);
        setStatus("Sign-in failed. Redirecting…");
        setTimeout(() => router.replace("/login"), 2000);
      }
    });

    // Check periodically in case Hub event was missed
    const checkUser = async () => {
      try {
        const { fetchAuthSession } = await import("aws-amplify/auth");
        await fetchAuthSession();
        const user = await getCurrentUser();
        if (user) {
          console.log("User found via getCurrentUser(), redirecting to /todo");
          setIsLoggedIn(true);
          router.replace("/todo");
          return true;
        }
      } catch (err) {
        console.error("Auth Session Error:", err);
      }
      return false;
    };

    // Initial check
    checkUser();

    // Polling as fallback
    const interval = setInterval(async () => {
      const found = await checkUser();
      if (found) clearInterval(interval);
    }, 1000);

    // Safety timeout: if after 15 seconds we are still here, try to go to todo anyway or back to login
    const timeout = setTimeout(() => {
      console.log("Auth callback timeout reached. Attempting final check...");
      checkUser().then(found => {
        if (!found) {
          console.log("No user found after 15s, redirecting to login");
          router.replace("/login");
        }
      });
    }, 15000);

    return () => {
      console.log("AuthCallbackPage unmounting, cleaning up...");
      unsubscribe();
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 text-sm">{status}</p>
        {isLoggedIn && (
          <button
            onClick={() => router.replace("/todo")}
            className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Continue to Dashboard
          </button>
        )}
      </div>
    </div>
  );
}
