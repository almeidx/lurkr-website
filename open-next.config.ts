import { defineCloudflareConfig } from "@opennextjs/cloudflare/config";
import kvIncrementalCache from "@opennextjs/cloudflare/kv-cache";

export default defineCloudflareConfig({
	incrementalCache: kvIncrementalCache,
});
