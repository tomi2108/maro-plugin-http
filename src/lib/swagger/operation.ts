import { SwaggerOperation, SwaggerParameter, SwaggerRequestBody, SwaggerResponse } from "./file";

export class SwaggerOperationBuilder {
  private parameters: SwaggerParameter[] = [];
  private requestBody?: SwaggerRequestBody;
  private responses: Record<string, SwaggerResponse> = {};

  withPathParams(names: string[]) {
    this.parameters.push(
      ...names.map((name) => ({
        name,
        in: "path",
        required: true,
        schema: { type: "string" }
      } as const))
    );
    return this;
  }

  withQueryParams(names: string[]) {
    this.parameters.push(
      ...names.map((name) => ({
        name,
        in: "query",
        required: false,
        schema: { type: "string" }
      } as const))
    );
    return this;
  }

  withJsonRequestBody() {
    this.requestBody = {
      content: {
        "application/json": {
          schema: {
            type: "object"
          }
        }
      }
    };
    return this;
  }

  withDefaultResponses() {
    this.responses = {
      200: { description: "OK" },
      400: { description: "BAD_REQUEST" },
      500: { description: "INTERNAL_SERVER_ERROR" }
    };
    return this;
  }

  build() {
    const operation: SwaggerOperation = {
      parameters: this.parameters,
      responses: this.responses
    };

    if (this.requestBody) {
      operation.requestBody = this.requestBody;
    }

    return operation;
  }
}

