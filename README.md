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

web: (CF Pages)
```sh
cd web; bun run deploy
```

server: (Fly.io)
```sh
cd server; bun run deploy
```
