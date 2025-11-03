import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Request, type Response, type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { StatusCodes } from "http-status-codes";

export const healthCheckRegistry = new OpenAPIRegistry();
export const healthCheckRouter: Router = express.Router();

healthCheckRouter.get("/", (_req: Request, res: Response) => {
  const serviceResponse = ServiceResponse.success(StatusCodes.OK, "Service is healthy", null);
  return handleServiceResponse(serviceResponse, res);
});
healthCheckRegistry.registerPath({
  method: "get",
  path: "/api/health-check",
  operationId: "health-check",
  tags: ["Health Check"],
  responses: createApiResponse(StatusCodes.OK, "Success", z.null()),
});
