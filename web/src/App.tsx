import type { App as Server } from "server";
import { hc } from "hono/client";

const client = hc<Server>("http://localhost:3000");

function App() {
  client.index
    .$get()
    .then((it) => it.text())
    .then((it) => console.log(it));

  return <>Hello World</>;
}

export default App;
