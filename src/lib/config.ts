import z from "zod/v4";

import { ConfigHelp, ConfigSection } from "@maro/maro";

const schema = z.object({
  url_suffix: z.string().optional(),
  collection: z.string().optional(),
  postman_dir: z.string().optional(),
  generate_swagger: z.boolean().optional()
});

export class HttpConfig implements ConfigSection {
  key = "http";

  validate(config: unknown) {
    if (!config) return {};
    return schema.parse(config);
  }

  help(): ConfigHelp[] {
    return [
      { key: "url_suffix", description: "Suffix used to extract service name from host variable", type: "string" },
      { key: "collection", description: "Directory containing HTTP collection files", type: "string" },
      { key: "postman_dir", description: "Directory to save postman files relative to 'collection'", type: "string" },
      { key: "generate_swagger", description: "Generate swagger on every AppRepo mr", type: "boolean" }
    ];
  }

  async setup() {
    return {};
  }

}

