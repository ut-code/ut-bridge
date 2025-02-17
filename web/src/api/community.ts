import { client } from "../client";

const res = client.community.$get();
export const data = res.json();
