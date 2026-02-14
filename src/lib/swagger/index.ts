import { AppRepo } from "@maro/maro";

import { RegexParamExtractionStrategy } from "./params";
import { SwaggerPaths } from "./paths";
import { SwaggerRequestAdapter } from "./request";
import { HttpFile } from "../http_file";
import { SwaggerFile } from "./file";

export class Swagger {

  constructor(
    private readonly file: HttpFile,
    private readonly app_repo: AppRepo
  ) {
  }

  generate() {
    const { description, version } = this.app_repo.getPackage();

    const pathsBuilder = new SwaggerPaths();
    for (const req of this.file.getRequests()) {
      const adapter = new SwaggerRequestAdapter(req, new RegexParamExtractionStrategy());
      pathsBuilder.add(adapter.toSwaggerItem());
    }

    const content = {
      openapi: "3.0.2",
      info: {
        title: this.file.service,
        description,
        version
      },
      paths: pathsBuilder.build()
    };

    const file = this.app_repo.dir.sub("swagger").sub("docs").createFile("specification.yaml");
    const swagger = new SwaggerFile(file.path);
    swagger.write(content);
    return swagger;
  }
}

