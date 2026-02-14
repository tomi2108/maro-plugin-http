import { Req } from "../req";
import { PostmanRequestBody } from "./types";

interface BodyStrategy {
  supports(req: Req): boolean;
  createBody(req: Req): any;
}

export class JsonBodyStrategy implements BodyStrategy {

  supports(req: Req) {
    return Boolean(req.body?.trim() && req.body.includes("{"));
  }

  createBody(req: Req): PostmanRequestBody {
    return {
      mode: "raw",
      raw: req.body,
      options: { raw: { language: "json" } }
    };
  }
}
