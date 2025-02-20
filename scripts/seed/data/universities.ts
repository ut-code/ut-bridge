export type Division = {
  name: string;
};
export type Campus = { name: string };
export type University = {
  name: string;
  campuses: Campus[];
  divisions: Division[];
};

export const universities: University[] = [
  {
    name: "東京大学",
    campuses: [
      { name: "本郷キャンパス" },
      { name: "駒場キャンパス" },
      { name: "柏キャンパス" },
      { name: "白金台キャンパス" },
      { name: "中野キャンパス" },
    ],
    divisions: [
      // 大学の学部
      { name: "法学部" },
      { name: "医学部" },
      { name: "工学部" },
      { name: "文学部" },
      { name: "理学部" },
      { name: "農学部" },
      { name: "経済学部" },
      { name: "教養学部" },
      { name: "教育学部" },
      { name: "薬学部" },

      // 大学院
      { name: "人文社会系研究科" },
      { name: "教育学研究科" },
      { name: "法学政治学研究科" },
      { name: "経済学研究科" },
      { name: "総合文化研究科" },
      { name: "理学系研究科" },
      { name: "工学系研究科" },
      { name: "農学生命科学研究科" },
      { name: "医学系研究科" },
      { name: "薬学系研究科" },
      { name: "数理科学研究科" },
      { name: "新領域創成科学研究科" },
      { name: "情報理工学系研究科" },
      { name: "情報学環・学際情報学府" },
      { name: "公共政策大学院(公共政策学連携研究部・教育部)" },
    ],
  },
];
