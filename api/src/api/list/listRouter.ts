import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";
import { StatusCodes } from "http-status-codes";

import { CreateListSchema, GetListSchema, UpdateListSchema, ListSchema } from "@/api/list/listModel";
import { createApiResponses } from "@/api-docs/openAPIResponseBuilders";
import { validateRequest } from "@/common/utils/httpHandlers";
import { listController } from "./listController";

export const listRegistry = new OpenAPIRegistry();
export const listRouter: Router = express.Router();

listRegistry.register("List", ListSchema);

listRouter.post("/", listController.createList);
listRegistry.registerPath({
  method: "post",
  path: "/api/lists",
  operationId: "createList",
  description: "Create a list",
  summary: "Create List",
  tags: ["List"],
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: CreateListSchema.shape.body,
          example: {
            name: "List 1",
            id_board: 1,
          },
        },
      },
    },
  },
  responses: createApiResponses([
    {
      statusCode: StatusCodes.CREATED,
      description: "List successfully created",
      schema: z.array(ListSchema),
    },
    {
      statusCode: StatusCodes.BAD_REQUEST,
      description: "Invalid data supplied.",
    },
    {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      description: "An error occurred while creating the list.",
    },
  ]),
});

listRouter.get("/", listController.getLists);
listRegistry.registerPath({
  method: "get",
  path: "/api/lists",
  operationId: "findAllLists",
  description: "Retrieve all lists",
  summary: "Get all Lists",
  tags: ["List"],
  responses: createApiResponses([
    {
      statusCode: StatusCodes.OK,
      description: "All lists successfully found",
      schema: z.array(ListSchema),
    },
    {
      statusCode: StatusCodes.NOT_FOUND,
      description: "No lists found",
    },
    {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      description: "An error occurred while retrieving all lists",
    },
  ]),
});

listRouter.get("/:id", validateRequest(GetListSchema), listController.getList);
listRegistry.registerPath({
  method: "get",
  path: "/api/lists/{id}",
  operationId: "findListById",
  description: "Retrieve a list by their ID",
  summary: "Get List",
  tags: ["List"],
  request: { params: GetListSchema.shape.params },
  responses: createApiResponses([
    {
      statusCode: StatusCodes.OK,
      description: "List successfully found",
      schema: ListSchema,
    },
    {
      statusCode: StatusCodes.BAD_REQUEST,
      description: "Invalid data supplied",
    },
    {
      statusCode: StatusCodes.NOT_FOUND,
      description: "List not found",
    },
    {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      description: "An error occurred while finding the list",
    },
  ]),
});

listRouter.put("/:id", validateRequest(UpdateListSchema), listController.updateList);
listRegistry.registerPath({
  method: "put",
  path: "/api/lists/{id}",
  operationId: "updateList",
  description: "Update a list by their ID",
  summary: "Update List",
  tags: ["List"],
  request: {
    params: UpdateListSchema.shape.params,
    body: {
      required: true,
      content: {
        "application/json": { schema: UpdateListSchema.shape.body },
      },
    },
  },
  responses: createApiResponses([
    {
      statusCode: StatusCodes.OK,
      description: "List successfully updated",
      schema: z.null(),
    },
    {
      statusCode: StatusCodes.BAD_REQUEST,
      description: "Invalid data supplied",
    },
    {
      statusCode: StatusCodes.NOT_FOUND,
      description: "List not found",
    },
    {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      description: "An error occurred while updating the list",
    },
  ]),
});

listRouter.delete("/:id", validateRequest(GetListSchema), listController.deleteList);
listRegistry.registerPath({
  method: "delete",
  path: "/api/lists/{id}",
  operationId: "deleteList",
  description: "Delete a list by their ID",
  summary: "Delete List",
  tags: ["List"],
  request: { params: GetListSchema.shape.params },
  responses: createApiResponses([
    {
      statusCode: StatusCodes.OK,
      description: "List successfully deleted",
      schema: z.null(),
    },
    {
      statusCode: StatusCodes.BAD_REQUEST,
      description: "Invalid data supplied",
    },
    {
      statusCode: StatusCodes.NOT_FOUND,
      description: "List not found",
    },
    {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      description: "An error occurred while deleting the list",
    },
  ]),
});
