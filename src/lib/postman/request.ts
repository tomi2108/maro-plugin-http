import { Req, varRegex } from "../req";
import { JsonBodyStrategy } from "./body";
import { PostmanHeader, PostmanRequestBody, PostmanRequestItem, PostmanUrl } from "./types";

export class PostmanRequestAdapter {
  constructor(private readonly req: Req) { }

  toPostmanItem(): PostmanRequestItem {
    const builder = new PostmanRequestBuilder();

    builder
      .setName(`${this.req.method.toUpperCase()} ${this.req.pathname}`)
      .setMethod(this.req.method.toUpperCase())
      .setUrl(this.buildUrl())
      .setHeaders(...this.buildHeaders());

    const body = this.buildBody();
    if (body) builder.setBody(body);

    return builder.build();
  }

  private buildUrl(): PostmanUrl {
    const path = this.req.pathname.replace(varRegex, ":$1");
    return {
      raw: path,
      protocol: "http",
      host: [path.split("/")[1] || ""],
      path: path.split("/").slice(2),
      query: Object.entries(this.req.params ?? {})
        .filter(([, v]) => v)
        .map(([key, val]) => ({
          key,
          value: val!.toString()
        }))
    };
  }

  private buildHeaders(): PostmanHeader[] {
    return Object.entries(this.req.headers ?? {})
      .filter(([, v]) => v)
      .map(([key, value]) => ({ key, value })) as PostmanHeader[]; // we are filtering nulls
  }

  private buildBody(): PostmanRequestBody | undefined {
    // TODO: probably iterate over available strategies
    // to identify which to use
    const strategy = new JsonBodyStrategy();
    if (strategy.supports(this.req)) return strategy.createBody(this.req);
    return undefined;
  }

}

class PostmanRequestBuilder {
  private readonly item: Partial<PostmanRequestItem> = {};

  setName(name: string) {
    this.item.name = name;
    return this;
  }

  setMethod(method: string) {
    this.item.request ??= { method };
    this.item.request.method = method;
    return this;
  }

  setUrl(url: PostmanUrl) {
    this.item.request ??= { url };
    this.item.request.url = url;
    return this;
  }

  setHeaders(...header: PostmanHeader[]) {
    this.item.request ??= { header };
    this.item.request.header = header;
    return this;
  }

  setBody(body: PostmanRequestBody) {
    this.item.request ??= { body };
    this.item.request.body = body;
    return this;
  }

  build(): PostmanRequestItem {
    // TODO: probably validate this has been properly built
    return this.item as PostmanRequestItem;
  }
}
