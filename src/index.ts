import { PostmanCommand } from "./commands/postman";
import { SwaggerCommand } from "./commands/swagger";
import { PluginExport } from "@maro/maro";
import { HttpConfig } from "./lib/config";

const Plugin: PluginExport = {
  name: "maro-plugin-http",
  configs: [
    new HttpConfig()
  ],
  commands: [
    {
      name: "http",
      description: "Generate postman collections and swagger from .http files",
      subcommands: [
        SwaggerCommand,
        PostmanCommand
      ]
    }
  ]
};

export default Plugin;
