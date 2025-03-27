import * as t from "bun:test";
import { expect, test } from "bun:test";

import * as nextNavigation from "next/navigation";
import { useNormalizedPathname } from "./useNormalizedPath.ts";

test("/ja/login -> /login", () => {
  t.spyOn(nextNavigation, "usePathname").mockReturnValue("/ja/login");
  const normalizedPath = useNormalizedPathname();
  expect(normalizedPath).toBe("/login");
});

test("/en/login -> /login", () => {
  t.spyOn(nextNavigation, "usePathname").mockReturnValue("/en/login");
  const normalizedPath = useNormalizedPathname();
  expect(normalizedPath).toBe("/login");
});

test("/ja/settings/basic -> /settings/basic", () => {
  t.spyOn(nextNavigation, "usePathname").mockReturnValue("/ja/settings/basic");
  const normalizedPath = useNormalizedPathname();
  expect(normalizedPath).toBe("/settings/basic");
});

test("/ja -> ''", () => {
  t.spyOn(nextNavigation, "usePathname").mockReturnValue("/ja");
  const normalizedPath = useNormalizedPathname();
  expect(normalizedPath).toBe("");
});
