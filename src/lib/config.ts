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
      { key: "url_suffix", description: "Suffix used to extract service name from host variable" },
      { key: "collection", description: "Directory containing HTTP collection files" },
      { key: "postman_dir", description: "Directory to save postman files relative to 'collection'" },
      { key: "generate_swagger", description: "Generate swagger on every AppRepo mr" }
    ];
  }

  async setup() {
    return {};
  }

}

