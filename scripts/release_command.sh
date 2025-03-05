set -eu

cd "$(dirname -- "$0")"
cd ..

(
  cd server
  bun prisma db push --accept-data-loss
)

bun db:seed || true
