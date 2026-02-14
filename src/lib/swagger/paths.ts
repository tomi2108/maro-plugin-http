import { SwaggerPathItem } from "./file";

export class SwaggerPaths {
  private paths: Record<string, SwaggerPathItem> = {};

  add(fragment: SwaggerPathItem) {
    for (const [path, methods] of Object.entries(fragment)) {
      this.paths[path] ??= {};
      Object.assign(this.paths[path], methods);
    }
  }

  build() {
    return this.paths;
  }
}

