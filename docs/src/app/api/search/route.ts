import { createFromSource } from "fumadocs-core/search/server";
import { source } from "@/lib/source.ts";

export const { GET } = createFromSource(source);
