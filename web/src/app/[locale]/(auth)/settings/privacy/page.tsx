"use client";

export default function Page() {
  return (
    <div className="px-4 py-10 sm:px-6 md:px-8 dark:from-zinc-900 dark:to-zinc-800">
      <div className="mx-auto max-w-3xl space-y-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-xl sm:p-8 dark:border-zinc-700 dark:bg-zinc-900">
        <div className="flex items-center gap-3">
          <h1 className="font-bold text-2xl text-gray-800 sm:text-3xl dark:text-white">プライバシーポリシー</h1>
        </div>
        <p className="text-base text-gray-600 sm:text-lg dark:text-gray-300">
          本サービスにおけるユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下、「本ポリシー」といいます。）を定めます。
        </p>

        {[
          {
            title: "01. 個人情報の収集目的",
            content:
              "取得した個人情報は次の各号の目的の達成に必要な範囲でのみ使用いたします。法令で認められる場合を除いて、本人の同意を得ることなく、利用目的の範囲を超えて個人情報を利用いたしません。",
            list: [
              "ユーザの個人認証及びユーザ向け本サービスの提供",
              "本サービスの利用に伴う連絡・メールマガジン・DM・各種お知らせ等の配信・送付",
              "本サービスの改善・新規サービスの開発・分析およびマーケティング",
              "キャンペーン・アンケート・モニター・取材等の実施",
              "本サービスに関するご意見、お問い合わせ、クチコミ投稿内容の確認・回答",
            ],
          },
          {
            title: "02. 個人情報の管理",
            content:
              "ご提出いただく個人情報は、運営団体にて正確な状態に保ち、不正アクセス・紛失・破壊・改ざんおよび漏洩等を防止するための措置を講じます。",
          },
          {
            title: "03. 個人情報の第三者提供について",
            content:
              "ご提出いただく個人情報を、貴方の同意なく第三者に提供することはございません。但し、法令に基づく場合や、人の生命、身体、又は財産の保護のために必要がある場合であって本人の同意を得ることが困難であるときは、やむを得ず提供する場合がございます。",
          },
          {
            title: "04. 個人情報の外部委託について",
            content:
              "利用目的の範囲内でご提出いただく個人情報の取扱いを一部、または全部を委託する場合、十分な個人情報の保護水準を満たしている者を選定する基準を確立、選定し、管理監督いたします。",
          },
          {
            title: "05. 個人情報提供の任意性",
            content:
              "本サービスにおいてそれぞれ必要となる項目を入力いただかない場合は、本サービスを受けられない場合がございます。",
          },
          {
            title: "06. 統計処理されたデータの利用",
            content:
              "本サービスでは提供を受けた個人情報をもとに、個人を特定できないよう加工した統計データを作成することがございます。個人を特定できない統計データについては、運営団体は何ら制限なく利用することができるものといたします。",
          },
          {
            title: "07. 個人情報の開示等",
            content:
              "ご提出頂く個人情報について、貴方は利用目的の通知、開示、内容の訂正、追加又は削除、利用の停止、消去及び第三者への提供の停止（以下「開示等」といいます。）を請求することができます。ご自身の個人情報の開示等を請求される場合は、下記の窓口にご連絡ください。なお、ご本人確認のための手続きを行う場合がございます。",
          },
          {
            title: "08. プライバシーポリシーの変更",
            content:
              "本ポリシーの内容は随時改定されることがあり、本ページにて常に最新のプライバシーポリシーを掲示しております。重要な変更がある場合は、サービス内での通知を通じてご案内いたします。",
          },
          {
            title: "09. お問い合わせ窓口",
            content:
              "個人情報の取扱いに関するお問い合わせは、以下の連絡先までご連絡ください。\n\n📧 contact@utcode.net",
          },
        ].map(({ title, content, list }) => (
          <section key={title} className="space-y-2">
            <h3 className="font-semibold text-blue-700 text-lg sm:text-xl dark:text-blue-400">{title}</h3>
            <p className="whitespace-pre-line text-base text-gray-700 sm:text-lg dark:text-gray-300">{content}</p>
            {list && (
              <ul className="list-disc pl-4 text-base text-gray-600 sm:text-lg dark:text-gray-300">
                {list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
