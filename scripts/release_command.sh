set -eu

cd "$(dirname -- "$0")"
cd ..

(
  cd server
  # TODO: create migration rather than accepting its fate
  bun prisma db push --accept-data-loss
)

bun db:seed || true
