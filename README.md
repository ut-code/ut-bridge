# ut-bridge

## 開発

### 必要なパッケージ

- Bun >= v1.2

### 環境構築

1. `bun install` を実行します。
2. `.env` を作成し、 `.env.sample` をコピーします
3. `bun dev` を実行すると、 <http://localhost:5173> でフロントエンドサーバーが起動し、 <http://localhost:3000> でバックエンドのサーバーが起動します。

0. `bun clean` で `.env` 以外の不要なファイルが消えます。

## 運用

### デプロイ

毎週のミーティングでデプロイします。

0. ステージング環境が動いていることを確認する
1. Fly.io や Cloudflare の環境変数を更新する
2. データベースのスキーマを更新する
  - `DATABASE_URL=[production database url] bunx prisma db push`
3. release <- main にリベースする
  - `git checkout release; git rebase main`
4. release にプッシュする
  - `git push`
5. Fly.io、cloudflare のダッシュボードで、ちゃんと更新されていることを確認する
6. プロダクションの動作確認をする
