import { source } from "@/lib/source.ts";
import { createFromSource } from "fumadocs-core/search/server";

export const runtime = "edge";

export const { GET } = createFromSource(source);
