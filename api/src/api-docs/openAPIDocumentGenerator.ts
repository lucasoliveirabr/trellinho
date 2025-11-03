import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";

import { cardRegistry } from "@/api/card/cardRouter";
import { healthCheckRegistry } from "@/api/healthCheck/healthCheckRouter";
import { listRegistry } from "@/api/list/listRouter";
import { boardRegistry } from "@/api/board/boardRouter";

export function generateOpenAPIDocument() {
  const registry = new OpenAPIRegistry([healthCheckRegistry, cardRegistry, listRegistry, boardRegistry]);
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Swagger API",
    },
    externalDocs: {
      description: "View the raw OpenAPI Specification in JSON format",
      url: "/swagger.json",
    },
  });
}
