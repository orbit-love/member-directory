import { render, fireEvent, screen } from "@testing-library/react";
import { useSession } from "next-auth/react";
import MemberList from "./member-list";

jest.mock("next-auth/react");

describe("MemberList", () => {
  const members = [
    {
      id: "1",
      name: "Test Member 1",
      avatar_url: "http://testavatar1.com",
      shownInDirectory: true,
      shownInPublicDirectory: true,
      identities: [
        {
          id: 1,
          type: "twitter_identity",
          profile_url: "https://www.google.com",
          username: "testTwitter",
        },
      ],
    },
    {
      id: "2",
      name: "Test Member 2",
      avatar_url: "http://testavatar2.com",
      shownInDirectory: true,
      shownInPublicDirectory: true,
      identities: [
        {
          id: 2,
          type: "linkedin_identity",
          profile_url: "https://www.google.com",
          username: "testLinkedin",
        },
      ],
    },
  ];

  beforeEach(() => {
    useSession.mockReturnValue({ data: { user: { name: "Test Member" } } });
  });

  afterEach(() => {
    useSession.mockClear();
  });

  it("renders with default listClasses if none are provided", () => {
    render(<MemberList members={members} preview title="Test Title" />);

    const listElement = document.querySelector("ul");
    expect(listElement).toHaveClass(
      "grid grid-cols-1 gap-x-6 gap-y-20 mt-6 mx-auto max-w-2xl sm:grid-cols-2 lg:gap-x-10 lg:max-w-6xl xl:max-w-none 2xl:grid-cols-3"
    );

    const title = screen.getByText("Test Title");
    expect(title).toBeInTheDocument();
  });

  describe("rendering a preview", () => {
    it("does not show members who haven't opted-in to the directory", () => {
      const members = [
        {
          id: "1",
          name: "Test Member 1",
          shownInDirectory: true,
          shownInPublicDirectory: true,
        },
        {
          id: "2",
          name: "Test Member 2",
          shownInDirectory: false,
          shownInPublicDirectory: true,
        },
      ];

      render(<MemberList members={members} preview title="Test Title" />);

      const nameElement = screen.getByText(members[0].name);
      expect(nameElement).toBeInTheDocument();

      const hiddenNameElement = screen.queryByText(members[1].name);
      expect(hiddenNameElement).not.toBeInTheDocument();
    });

    it("does not show members who haven't opted-in to the public directory", () => {
      const members = [
        {
          id: "1",
          name: "Test Member 1",
          shownInDirectory: true,
          shownInPublicDirectory: true,
        },
        {
          id: "2",
          name: "Test Member 2",
          shownInDirectory: true,
          shownInPublicDirectory: false,
        },
      ];

      render(<MemberList members={members} preview title="Test Title" />);

      const nameElement = screen.getByText(members[0].name);
      expect(nameElement).toBeInTheDocument();

      const hiddenNameElement = screen.queryByText(members[1].name);
      expect(hiddenNameElement).not.toBeInTheDocument();
    });

    it("shows only the member name and profile picture", () => {
      render(<MemberList members={members} preview title="Test Title" />);

      const nameElements = [
        screen.getByText(members[0].name),
        screen.getByText(members[1].name),
      ];

      expect(nameElements[0]).toBeInTheDocument();
      expect(nameElements[1]).toBeInTheDocument();

      const avatarElements = document.querySelectorAll("img");

      expect(avatarElements[0]).toBeInTheDocument();
      expect(avatarElements[0].src).toContain("testavatar1");

      expect(avatarElements[1]).toBeInTheDocument();
      expect(avatarElements[1].src).toContain("testavatar2");

      const twitterElement = screen.queryByText("@testTwitter");
      expect(twitterElement).not.toBeInTheDocument();

      const linkedinElement = screen.queryByText("@testLinkedin");
      expect(linkedinElement).not.toBeInTheDocument();
    });
  });

  describe("rendering a full card", () => {
    it("does not show members who haven't opted-in to the directory", () => {
      const members = [
        {
          id: "1",
          name: "Test Member 1",
          shownInDirectory: true,
          shownInPublicDirectory: true,
          identities: [],
        },
        {
          id: "2",
          name: "Test Member 2",
          shownInDirectory: false,
          shownInPublicDirectory: true,
          identities: [],
        },
      ];

      render(<MemberList members={members} title="Test Title" />);

      const nameElement = screen.getByText(members[0].name);
      expect(nameElement).toBeInTheDocument();

      const hiddenNameElement = screen.queryByText(members[1].name);
      expect(hiddenNameElement).not.toBeInTheDocument();
    });

    it("shows members who haven't opted-in to the public directory", () => {
      const members = [
        {
          id: "1",
          name: "Test Member 1",
          shownInDirectory: true,
          shownInPublicDirectory: true,
          identities: [],
        },
        {
          id: "2",
          name: "Test Member 2",
          shownInDirectory: true,
          shownInPublicDirectory: false,
          identities: [],
        },
      ];

      render(<MemberList members={members} title="Test Title" />);

      const nameElement = screen.getByText(members[0].name);
      expect(nameElement).toBeInTheDocument();

      const hiddenNameElement = screen.getByText(members[1].name);
      expect(hiddenNameElement).toBeInTheDocument();
    });
    it("shows the full member card", () => {
      render(<MemberList members={members} title="Test Title" />);

      const nameElements = [
        screen.getByText(members[0].name),
        screen.getByText(members[1].name),
      ];

      expect(nameElements[0]).toBeInTheDocument();
      expect(nameElements[1]).toBeInTheDocument();

      const twitterElement = screen.getByText("@testTwitter");
      expect(twitterElement).toBeInTheDocument();

      const linkedinElement = screen.getByText("@testLinkedin");
      expect(linkedinElement).toBeInTheDocument();
    });
  });
});
