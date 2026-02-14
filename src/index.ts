import { PostmanCommand } from "./commands/postman";
import { SwaggerCommand } from "./commands/swagger";
import { PluginExport } from "../../../dist/lib";

const Plugin: PluginExport = {
  name: "maro-plugin-http",
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
