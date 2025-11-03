import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";
import { StatusCodes } from "http-status-codes";

import { CreateBoardSchema, GetBoardSchema, UpdateBoardSchema, BoardSchema } from "@/api/board/boardModel";
import { createApiResponses } from "@/api-docs/openAPIResponseBuilders";
import { validateRequest } from "@/common/utils/httpHandlers";
import { boardController } from "./boardController";

export const boardRegistry = new OpenAPIRegistry();
export const boardRouter: Router = express.Router();

boardRegistry.register("Board", BoardSchema);

boardRouter.post("/", boardController.createBoard);
boardRegistry.registerPath({
  method: "post",
  path: "/api/boards",
  operationId: "createBoard",
  description: "Create a board",
  summary: "Create Board",
  tags: ["Board"],
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: CreateBoardSchema.shape.body,
          example: {
            name: "Board 1",
          },
        },
      },
    },
  },
  responses: createApiResponses([
    {
      statusCode: StatusCodes.CREATED,
      description: "Board successfully created",
      schema: z.array(BoardSchema),
    },
    {
      statusCode: StatusCodes.BAD_REQUEST,
      description: "Invalid data supplied.",
    },
    {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      description: "An error occurred while creating the board.",
    },
  ]),
});

boardRouter.get("/", boardController.getBoards);
boardRegistry.registerPath({
  method: "get",
  path: "/api/boards",
  operationId: "findAllBoards",
  description: "Retrieve all boards",
  summary: "Get all Boards",
  tags: ["Board"],
  responses: createApiResponses([
    {
      statusCode: StatusCodes.OK,
      description: "All boards successfully found",
      schema: z.array(BoardSchema),
    },
    {
      statusCode: StatusCodes.NOT_FOUND,
      description: "No boards found",
    },
    {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      description: "An error occurred while retrieving all boards",
    },
  ]),
});

boardRouter.get("/:id", validateRequest(GetBoardSchema), boardController.getBoard);
boardRegistry.registerPath({
  method: "get",
  path: "/api/boards/{id}",
  operationId: "findBoardById",
  description: "Retrieve a board by their ID",
  summary: "Get Board",
  tags: ["Board"],
  request: { params: GetBoardSchema.shape.params },
  responses: createApiResponses([
    {
      statusCode: StatusCodes.OK,
      description: "Board successfully found",
      schema: BoardSchema,
    },
    {
      statusCode: StatusCodes.BAD_REQUEST,
      description: "Invalid data supplied",
    },
    {
      statusCode: StatusCodes.NOT_FOUND,
      description: "Board not found",
    },
    {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      description: "An error occurred while finding the board",
    },
  ]),
});

boardRouter.put("/:id", validateRequest(UpdateBoardSchema), boardController.updateBoard);
boardRegistry.registerPath({
  method: "put",
  path: "/api/boards/{id}",
  operationId: "updateBoard",
  description: "Update a board by their ID",
  summary: "Update Board",
  tags: ["Board"],
  request: {
    params: UpdateBoardSchema.shape.params,
    body: {
      required: true,
      content: {
        "application/json": { schema: UpdateBoardSchema.shape.body },
      },
    },
  },
  responses: createApiResponses([
    {
      statusCode: StatusCodes.OK,
      description: "Board successfully updated",
      schema: z.null(),
    },
    {
      statusCode: StatusCodes.BAD_REQUEST,
      description: "Invalid data supplied",
    },
    {
      statusCode: StatusCodes.NOT_FOUND,
      description: "Board not found",
    },
    {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      description: "An error occurred while updating the board",
    },
  ]),
});

boardRouter.delete("/:id", validateRequest(GetBoardSchema), boardController.deleteBoard);
boardRegistry.registerPath({
  method: "delete",
  path: "/api/boards/{id}",
  operationId: "deleteBoard",
  description: "Delete a board by their ID",
  summary: "Delete Board",
  tags: ["Board"],
  request: { params: GetBoardSchema.shape.params },
  responses: createApiResponses([
    {
      statusCode: StatusCodes.OK,
      description: "Board successfully deleted",
      schema: z.null(),
    },
    {
      statusCode: StatusCodes.BAD_REQUEST,
      description: "Invalid data supplied",
    },
    {
      statusCode: StatusCodes.NOT_FOUND,
      description: "Board not found",
    },
    {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      description: "An error occurred while deleting the board",
    },
  ]),
});
