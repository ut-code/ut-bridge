export const blocks: PathBlock[] = [
  {
    // 俺
    title: "headers.info",
    items: [
      {
        href: "/settings/basic",
        title: "basic.title",
      },
      {
        href: "/settings/university",
        title: "university.title",
      },
      {
        href: "/settings/language",
        title: "language.title",
      },
      {
        href: "/settings/topic",
        title: "topic.title",
      },
    ],
  },
  {
    // 俺以外
    title: "headers.users",
    items: [
      {
        href: "/settings/favorite",
        title: "favorite.title",
      },
      {
        href: "/settings/block",
        title: "block.title",
      },
    ],
  },
  {
    // その他
    title: "headers.other",
    items: [
      {
        href: "/settings/privacy",
        title: "other.privacy.title",
      },
      {
        href: "/settings/terms",
        title: "other.terms.title",
      },
      { href: "/settings/delete", title: "delete.title" },
    ],
  },
];

export type PathBlock = {
  title: string;
  items: {
    href: string;
    title: string;
  }[];
};
