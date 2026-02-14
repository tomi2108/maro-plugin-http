import { Config, ConfigError, ObjectFile } from "@maro/maro";

import { HttpFileContent, HttpFormatter } from "./formatter";
import { Req } from "./req";

export class HttpFile extends ObjectFile<HttpFileContent> {
  service: string;

  constructor(file_path: string) {
    super(file_path, new HttpFormatter());
    const namespace_prefix = Config.getView().get("openshift.namespace_prefix");
    if (!namespace_prefix) throw new ConfigError("openshift.namespace_prefix");
    // TODO: I hate the idea of having http files linked to a particular service, find a better way
    const service = this.getVariables().host?.split(`-${namespace_prefix}`)?.[0];
    if (!service) throw new InvalidHttpFile(file_path, "Could not find host variable to determine service name");
    this.service = service;
  }

  getVariables() {
    return this.read().variables;
  }

  getRequests() {
    return this.read().requests.map((r) => new Req(r));
  }
}

export class InvalidHttpFile extends Error {
  constructor(file_path: string, reason = "") {
    super(`Invalid http file ${file_path} ${reason}`);
  }
}
