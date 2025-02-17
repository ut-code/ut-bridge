import { client } from "../client";

const res = await client.community.$get();
export const data = res.json();
