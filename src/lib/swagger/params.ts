import { Req, varRegex } from "../req";

export interface ExtractedParams {
  pathParams: string[];
  queryParams: string[];
}

export interface ParamExtractionStrategy {
  extract(req: Req): ExtractedParams;
}

export class RegexParamExtractionStrategy implements ParamExtractionStrategy {

  extract(req: Req): ExtractedParams {

    const pathParams = Array.from(req.pathname.matchAll(varRegex)).map(
      (m) => m[1]
    ).filter((p): p is string => Boolean(p));

    const queryParams = Object.entries(req.params ?? {})
      .flatMap(([key, value]) => {
        if (!value) return [];
        return value.match(varRegex) ? [key] : [];
      });

    return { pathParams, queryParams };
  }
}

