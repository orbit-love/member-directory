import { useState } from "react";
import LayoutUnauthenticated from "../components/layout-unauthenticated";
import MemberList from "../components/member-list";

export default function Preview({ initialFeatured, initialMembers }) {
  const [featured] = useState(initialFeatured);
  const [members] = useState(initialMembers);

  const LIST_CLASSES =
    "grid grid-cols-1 gap-y-16 gap-x-40 mt-6 mx-auto max-w-2xl sm:grid-cols-3 lg:mx-0 lg:max-w-none 2xl:grid-cols-4";

  return (
    <LayoutUnauthenticated>
      <div className="px-6 w-full lg:px-8">
        <section className="mx-auto max-w-2xl sm:text-center">
          <h1 className="text-brand-dark dark:text-brand-light text-3xl font-bold tracking-tight sm:text-4xl">
            See DM Dinner Club Members
          </h1>

          <p className="text-brand-dark-highlight dark:text-brand-light-highlight mt-6 text-lg leading-8">
            This is a hub to discover members within this community. Sign in to
            see more details.
          </p>
        </section>

        <MemberList
          title="Featured Guests"
          members={featured}
          listClasses={LIST_CLASSES}
          preview
        />

        <MemberList
          title="All Members"
          members={members}
          listClasses={LIST_CLASSES}
          preview
        />
      </div>
    </LayoutUnauthenticated>
  );
}

// Fetch members from /api/preview-members route on component load (ie, initialise the data)
// This is set as default value for the useState for members
export async function getServerSideProps(context) {
  const res = await fetch(
    `http://${context.req.headers.host}/api/preview-members`
  );
  const data = await res.json();

  if (!data) {
    return {
      props: { initialMembers: [], initialFeatured: [] },
    };
  }

  return {
    props: {
      initialMembers: data.members || [],
      initialFeatured: data.featured || [],
    },
  };
}
