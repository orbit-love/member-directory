import handle from "./preview-members";
import { getAllMembers } from "../../helpers/prisma-helpers";

jest.mock("../../helpers/prisma-helpers", () => ({
  getAllMembers: jest.fn(),
}));

const res = {
  status: jest.fn().mockReturnThis(),
  send: jest.fn(),
  json: jest.fn(),
};

describe("/api/preview-members", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("responds with 200 and returns members", async () => {
    const expectedMembers = [
      { id: 1, email: "member1@faker.com", featured: false },
      { id: 2, email: "member2@faker.com", featured: false },
      { id: 3, email: "featured1@faker.com", featured: true },
      { id: 4, email: "featured2@faker.com", featured: true },
    ];

    getAllMembers.mockResolvedValueOnce(expectedMembers);

    const req = { method: "GET" };

    await handle(req, res);

    // Filters members to fetch
    expect(getAllMembers).toHaveBeenCalledWith({
      where: {
        shownInPublicDirectory: true,
        shownInDirectory: true,
      },
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      members: [expectedMembers[0], expectedMembers[1]],
      featured: [expectedMembers[2], expectedMembers[3]],
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
