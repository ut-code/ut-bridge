import * as nextNavigation from "next/navigation";
import { useNormalizedPathname } from "./useNormalizedPath.ts";

test("/ja/login -> /login", () => {
  jest.spyOn(nextNavigation, "usePathname").mockReturnValue("/ja/login");
  const normalizedPath = useNormalizedPathname();
  expect(normalizedPath).toBe("/login");
});

test("/en/login -> /login", () => {
  jest.spyOn(nextNavigation, "usePathname").mockReturnValue("/en/login");
  const normalizedPath = useNormalizedPathname();
  expect(normalizedPath).toBe("/login");
});

test("/ja/settings/basic -> /settings/basic", () => {
  jest.spyOn(nextNavigation, "usePathname").mockReturnValue("/ja/settings/basic");
  const normalizedPath = useNormalizedPathname();
  expect(normalizedPath).toBe("/settings/basic");
});

test("/ja -> ''", () => {
  jest.spyOn(nextNavigation, "usePathname").mockReturnValue("/ja");
  const normalizedPath = useNormalizedPathname();
  expect(normalizedPath).toBe("");
});
