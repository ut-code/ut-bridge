// @ts-check
/// <reference lib="dom" />

self.addEventListener("activate", (ev) => {
  try {
    console.log("ServiceWorker activated");
  } catch {}

  // @ts-expect-error
  ev.waitUntil(self.clients.claim());
});
