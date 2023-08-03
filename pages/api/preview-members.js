import prisma from "../../lib/db";
import { getAllMembers } from "../../helpers/prisma-helpers";

export default async function handle(req, res) {
  try {
    // Only fetch members shown in public preview
    const allMembers = await getAllMembers({
      where: { shownInPublicDirectory: true, shownInDirectory: true },
    });

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
