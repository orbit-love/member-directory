import prisma from "../../lib/db";
import { getAllMembers, getMemberByEmail } from "../../helpers/prisma-helpers";
import { withAuthCheck, withMethodCheck } from "../../helpers/api-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

async function handle(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);

    // Fetch current user -> as a targeted request, this should be fairly
    // small & fast, so I'm happy to keep that outside of the main loop
    const currentMember = await getMemberByEmail(session.user.email);

    // Fetch all other members
    const allMembers = await getAllMembers({
      where: { NOT: { email: session.user.email } },
    });

    // Put current member to the top of the respective list so they show up first
    allMembers.unshift(currentMember);

    let featured = [];
    let members = [];

    // Categorise members into "filtered" or "not featured". Only iterate on data once
    allMembers.forEach((member) => {
      member.featured ? featured.push(member) : members.push(member);
    });

    res.status(200).json({ featured, members });
  } catch (e) {
    console.error(`Something went wrong. ${e.message}`);
    res.status(500).send();
  } finally {
    await prisma.$disconnect();
  }
}

export default withAuthCheck(withMethodCheck(handle, "GET"));
