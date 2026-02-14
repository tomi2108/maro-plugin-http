
import { Req, varRegex } from "../req";
import { SwaggerPathItem } from "./file";
import { SwaggerOperationBuilder } from "./operation";
import { ParamExtractionStrategy } from "./params";

export class SwaggerRequestAdapter {
  constructor(
    private req: Req,
    private readonly paramStrategy: ParamExtractionStrategy
  ) { }

  toSwaggerItem(): SwaggerPathItem {
    const path = this.req.pathname.replace(varRegex, "{$1}");
    const { pathParams, queryParams } = this.paramStrategy.extract(this.req);

    const builder = new SwaggerOperationBuilder()
      .withPathParams(pathParams)
      .withQueryParams(queryParams)
      .withDefaultResponses();

    if (this.req.body && this.req.body.trim() !== "{}") {
      builder.withJsonRequestBody();
    }

    return {
      [path]: {
        [this.req.method.toLowerCase()]: builder.build()
      }
    };
  }
}

