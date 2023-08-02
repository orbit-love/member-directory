import LayoutUnauthenticated from "../../components/layout-unauthenticated";

export default function VerifyRequest() {
  return (
    <LayoutUnauthenticated>
      <div className="isolate relative px-6 mx-auto max-w-2xl text-center lg:px-8">
        <h1 className="text-brand-dark dark:text-brand-light text-4xl font-bold tracking-tight sm:text-6xl">
          Thanks!
        </h1>

        <p className="text-brand-dark dark:text-brand-light my-6 text-xl leading-8">
          If your details are listed in this directory, we've just sent you an
          email with a verification link. Click on that link to complete your
          sign-in process.
        </p>

        <small className="text-brand-dark-highlight dark:text-brand-light-highlight leading-8">
          If you did not receive an email, reach out to your community manager
          to verify you have access.
        </small>
      </div>
    </LayoutUnauthenticated>
  );
}
