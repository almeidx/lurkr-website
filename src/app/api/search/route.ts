import { source } from "@/lib/source.ts";
import { createFromSource } from "fumadocs-core/search/server";

export const { GET } = createFromSource(source);
