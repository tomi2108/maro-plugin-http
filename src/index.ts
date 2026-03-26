import { Config, ConfigRegistry, PluginExport } from "@maro/maro";

import { GenerateSwagger } from "./actions/generate_swagger";
import { PostmanCommand } from "./commands/postman";
import { SwaggerCommand } from "./commands/swagger";
import { HttpConfig } from "./lib/config";

const Plugin: PluginExport = {
  name: "maro-plugin-http",
  onLoad() {
    ConfigRegistry.register(
      new HttpConfig()
    );

    if (Config.getView().get("http.generate_swagger")) new GenerateSwagger().register();
  },
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
