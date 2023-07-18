import React from "react";
import Head from "next/head";
import Login from "./login";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Layout({ children }) {
  const { status } = useSession();
  const router = useRouter();

  // If user is unauthenticated, redirect to login page
  useEffect(() => {
    if (status === "unauthenticated") router.push("/api/auth/signin");
  }, [status]);

  // TODO: Better loading state (including Head)
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Head>
        <title>Member Directory</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Login />

      <main>{children}</main>
    </>
  );
}
