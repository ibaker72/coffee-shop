import { getRequestConfig } from "next-intl/server";

// Phase 1: single locale — no header reads, static rendering compatible.
// Phase 2: switch to `await requestLocale` and add locale routing when
// multiple languages are needed.
export default getRequestConfig(async () => {
  const locale = "en";
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
