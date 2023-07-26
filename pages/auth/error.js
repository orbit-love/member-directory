import Link from "next/link";
import LayoutUnauthenticated from "../../components/layout-unauthenticated";
import { useRouter } from "next/router";

export default function VerifyRequest() {
  // Fetch error code from query params
  const router = useRouter();
  const { error } = router.query;

  // If member shouldn't have access to the repository, show
  // them the same screen as if they had signed in successfully
  // - this is so we don't expose which emails are listed on the directory
  // Handled serverside by pages/api/auth/[...nextauth].js#signIn method,
  // this just helps if someone manually visits this page
  if (error === "AccessDenied") {
    router.replace("/auth/verify-request");
  }

  let title, preamble;

  // Set relevant error message for each of the error types listed in
  // https://next-auth.js.org/configuration/pages#error-page
  switch (error) {
    case "Verification":
      title = "Invalid link";
      preamble =
        "That link has expired or has already been used. Please sign in again to receive a new one.";
      break;
    case "Configuration":
      title = "Server Error";
      preamble = `There's something wrong with the server configuration.
        Ensure you have set environment variables correctly & try again.`;
      break;
    // Whilst error is being fetched, don't show anything - this is so we don't flash
    // the default error for about a frame before choosing which one to show
    case undefined:
      return;
    default:
      title = "Something went wrong";
      preamble =
        "Please try again later. If the issue persists, reach out to your community manager.";
      break;
  }

  return (
    <LayoutUnauthenticated>
      {router.isReady ? (
        <div className="isolate relative px-6 py-48 mx-auto max-w-2xl text-center lg:px-8 lg:py-64">
          <h1 className="text-4xl font-bold tracking-tight text-brand-dark sm:text-6xl dark:text-brand-light">
            {title}
          </h1>

          <p className="mt-6 text-xl leading-8 text-brand-dark-highlight dark:text-brand-light-highlight">
            {preamble}
          </p>

          <Link
            href="/auth/sign-in"
            className="inline-block flex-none py-3.5 px-5 mt-6 text-lg font-semibold text-brand-light bg-brand-accent rounded-md shadow-sm hover:bg-brand-accent-highlight focus-visible:outline-2 focus-visible:outline-brand-light focus-visible:outline focus-visible:outline-offset-2"
          >
            Back to login
          </Link>
        </div>
      ) : (
        ""
      )}
    </LayoutUnauthenticated>
  );
}
