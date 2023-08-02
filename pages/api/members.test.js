import handle from "./members";
import { getAllMembers, getMemberByEmail } from "../../helpers/prisma-helpers";

// ------------------------------------------------------
// Required when testing a route with withAuthCheck
jest.mock("./auth/[...nextauth]", () => ({
  authOptions: {},
}));

// Mock a valid session
jest.mock("next-auth/next", () => ({
  getServerSession: jest.fn().mockResolvedValue({
    user: { email: "session@faker.com" },
  }),
}));
// ------------------------------------------------------

jest.mock("../../helpers/prisma-helpers", () => ({
  getAllMembers: jest.fn(),
  getMemberByEmail: jest.fn(),
}));

const res = {
  status: jest.fn().mockReturnThis(),
  send: jest.fn(),
  json: jest.fn(),
};

describe("/api/members", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("responds with 200 and returns members & features seperately", async () => {
    const currentMember = {
      id: 5,
      email: "session@faker.com",
      featured: false,
    };

    const expectedMembers = [
      { id: 1, email: "member1@faker.com", featured: false },
      { id: 2, email: "member2@faker.com", featured: false },
      { id: 3, email: "featured1@faker.com", featured: true },
      { id: 4, email: "featured2@faker.com", featured: true },
    ];

    getMemberByEmail.mockResolvedValueOnce(currentMember);
    getAllMembers.mockResolvedValueOnce(expectedMembers);

    const req = { method: "GET" };

    await handle(req, res);

    // Fetches all members
    expect(getMemberByEmail).toHaveBeenCalledWith("session@faker.com");
    expect(getAllMembers).toHaveBeenCalledWith({
      where: { NOT: { email: "session@faker.com" } },
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      featured: [expectedMembers[2], expectedMembers[3]],
      members: [expectedMembers[0], expectedMembers[1]],
      currentMember: currentMember,
    });
  });

  it("responds with 500 when prisma query fails", async () => {
    getAllMembers.mockRejectedValueOnce(new Error("Test Error"));
    const req = { method: "GET" };

    await handle(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalled();
  });
});
