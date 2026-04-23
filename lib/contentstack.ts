import Contentstack from "contentstack";
import ContentstackLivePreview from "@contentstack/live-preview-utils";

const stackConfig: any = {
  api_key: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY!,
  delivery_token: process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN!,
  environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT!,
};

if (process.env.NEXT_PUBLIC_CONTENTSTACK_MANAGEMENT_TOKEN) {
  stackConfig.live_preview = {
    enable: true,
    management_token: process.env.NEXT_PUBLIC_CONTENTSTACK_MANAGEMENT_TOKEN,
    host: process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW_HOST || "",
  };
}

export const Stack = Contentstack.Stack(stackConfig);

// Published content is served from the delivery CDN, not the preview REST host.
// Prefer APP_HOST so calls hit e.g. dev11-cdn.* — required for most non-prod stacks.
if (process.env.NEXT_PUBLIC_CONTENTSTACK_APP_HOST) {
  Stack.setHost(process.env.NEXT_PUBLIC_CONTENTSTACK_APP_HOST);
} else if (process.env.NEXT_PUBLIC_CONTENTSTACK_LIVE_PREVIEW_HOST) {
  Stack.setHost(process.env.NEXT_PUBLIC_CONTENTSTACK_LIVE_PREVIEW_HOST);
}

if (process.env.NEXT_PUBLIC_CONTENTSTACK_MANAGEMENT_TOKEN) {
  try {
    ContentstackLivePreview.init({
      enable: true,
      stackSdk: Stack,
      ssr: true,
      clientUrlParams: {
        host: process.env.NEXT_PUBLIC_CONTENTSTACK_APP_HOST || "",
      },
    });
  } catch (error) {
    console.warn("Live preview initialization failed:", error);
  }
}
