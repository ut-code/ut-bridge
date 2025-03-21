export const blocks: PathBlock[] = [
  {
    title: "俺",
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
    title: "俺以外",
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
    title: "そのた",
    items: [
      {
        href: "/settings/other/privacy",
        title: "other.privacy.title",
      },
      {
        href: "/settings/other/terms",
        title: "other.terms.title",
      },
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
