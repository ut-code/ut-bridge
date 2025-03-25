export type Division = {
  in_ja: string;
  in_en: string;
};

export type Campus = {
  in_ja: string;
  in_en: string;
};

export type University = {
  in_ja: string;
  in_en: string;
  campuses: Campus[];
  divisions: Division[];
};

export const universities: University[] = [
  {
    in_ja: "東京大学",
    in_en: "The University of Tokyo",
    campuses: [
      { in_ja: "本郷キャンパス", in_en: "Hongo Campus" },
      { in_ja: "駒場キャンパス", in_en: "Komaba Campus" },
      { in_ja: "柏キャンパス", in_en: "Kashiwa Campus" },
      { in_ja: "白金台キャンパス", in_en: "Shirokanedai Campus" },
      { in_ja: "中野キャンパス", in_en: "Nakano Campus" },
    ],
    divisions: [
      { in_ja: "法学部", in_en: "Faculty of Law" },
      { in_ja: "医学部", in_en: "Faculty of Medicine" },
      { in_ja: "工学部", in_en: "Faculty of Engineering" },
      { in_ja: "文学部", in_en: "Faculty of Letters" },
      { in_ja: "理学部", in_en: "Faculty of Science" },
      { in_ja: "農学部", in_en: "Faculty of Agriculture" },
      { in_ja: "経済学部", in_en: "Faculty of Economics" },
      { in_ja: "教養学部", in_en: "College of Arts and Sciences" },
      { in_ja: "教育学部", in_en: "Faculty of Education" },
      { in_ja: "薬学部", in_en: "Faculty of Pharmaceutical Sciences" },

      {
        in_ja: "人文社会系研究科",
        in_en: "Graduate School of Humanities and Sociology",
      },
      { in_ja: "教育学研究科", in_en: "Graduate School of Education" },
      {
        in_ja: "法学政治学研究科",
        in_en: "Graduate Schools for Law and Politics",
      },
      { in_ja: "経済学研究科", in_en: "Graduate School of Economics" },
      {
        in_ja: "総合文化研究科",
        in_en: "Graduate School of Arts and Sciences",
      },
      { in_ja: "理学系研究科", in_en: "Graduate School of Science" },
      { in_ja: "工学系研究科", in_en: "Graduate School of Engineering" },
      {
        in_ja: "農学生命科学研究科",
        in_en: "Graduate School of Agricultural and Life Sciences",
      },
      { in_ja: "医学系研究科", in_en: "Graduate School of Medicine" },
      {
        in_ja: "薬学系研究科",
        in_en: "Graduate School of Pharmaceutical Sciences",
      },
      {
        in_ja: "数理科学研究科",
        in_en: "Graduate School of Mathematical Sciences",
      },
      {
        in_ja: "新領域創成科学研究科",
        in_en: "Graduate School of Frontier Sciences",
      },
      {
        in_ja: "情報理工学系研究科",
        in_en: "Graduate School of Information Science and Technology",
      },
      {
        in_ja: "情報学環・学際情報学府",
        in_en:
          "Interfaculty Initiative in Information Studies / Graduate School of Interdisciplinary Information Studies",
      },
      {
        in_ja: "公共政策大学院(公共政策学連携研究部・教育部)",
        in_en: "Graduate School of Public Policy (GraSPP)",
      },
    ],
  },
];
