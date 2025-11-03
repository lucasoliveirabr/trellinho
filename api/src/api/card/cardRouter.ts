import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";
import { StatusCodes } from "http-status-codes";

import { CreateCardSchema, GetCardSchema, UpdateCardSchema, CardSchema } from "@/api/card/cardModel";
import { createApiResponses } from "@/api-docs/openAPIResponseBuilders";
import { validateRequest } from "@/common/utils/httpHandlers";
import { cardController } from "./cardController";

export const cardRegistry = new OpenAPIRegistry();
export const cardRouter: Router = express.Router();

cardRegistry.register("Card", CardSchema);

cardRouter.post("/", cardController.createCard);
cardRegistry.registerPath({
  method: "post",
  path: "/api/cards",
  operationId: "createCard",
  description: "Create a card",
  summary: "Create Card",
  tags: ["Card"],
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: CreateCardSchema.shape.body,
          example: {
            name: "Task 1",
            description: "My first task.",
            status: "todo",
            id_list: 1,
          },
        },
      },
    },
  },
  responses: createApiResponses([
    {
      statusCode: StatusCodes.CREATED,
      description: "Card successfully created",
      schema: z.array(CardSchema),
    },
    {
      statusCode: StatusCodes.BAD_REQUEST,
      description: "Invalid data supplied.",
    },
    {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      description: "An error occurred while creating the card.",
    },
  ]),
});

cardRouter.get("/", cardController.getCards);
cardRegistry.registerPath({
  method: "get",
  path: "/api/cards",
  operationId: "findAllCards",
  description: "Retrieve all cards",
  summary: "Get all Cards",
  tags: ["Card"],
  responses: createApiResponses([
    {
      statusCode: StatusCodes.OK,
      description: "All cards successfully found",
      schema: z.array(CardSchema),
    },
    {
      statusCode: StatusCodes.NOT_FOUND,
      description: "No cards found",
    },
    {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      description: "An error occurred while retrieving all cards",
    },
  ]),
});

cardRouter.get("/:id", validateRequest(GetCardSchema), cardController.getCard);
cardRegistry.registerPath({
  method: "get",
  path: "/api/cards/{id}",
  operationId: "findCardById",
  description: "Retrieve a card by their ID",
  summary: "Get Card",
  tags: ["Card"],
  request: { params: GetCardSchema.shape.params },
  responses: createApiResponses([
    {
      statusCode: StatusCodes.OK,
      description: "Card successfully found",
      schema: CardSchema,
    },
    {
      statusCode: StatusCodes.BAD_REQUEST,
      description: "Invalid data supplied",
    },
    {
      statusCode: StatusCodes.NOT_FOUND,
      description: "Card not found",
    },
    {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      description: "An error occurred while finding the card",
    },
  ]),
});

cardRouter.put("/:id", validateRequest(UpdateCardSchema), cardController.updateCard);
cardRegistry.registerPath({
  method: "put",
  path: "/api/cards/{id}",
  operationId: "updateCard",
  description: "Update a card by their ID",
  summary: "Update Card",
  tags: ["Card"],
  request: {
    params: UpdateCardSchema.shape.params,
    body: {
      required: true,
      content: {
        "application/json": { schema: UpdateCardSchema.shape.body },
      },
    },
  },
  responses: createApiResponses([
    {
      statusCode: StatusCodes.OK,
      description: "Card successfully updated",
      schema: z.null(),
    },
    {
      statusCode: StatusCodes.BAD_REQUEST,
      description: "Invalid data supplied",
    },
    {
      statusCode: StatusCodes.NOT_FOUND,
      description: "Card not found",
    },
    {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      description: "An error occurred while updating the card",
    },
  ]),
});

cardRouter.delete("/:id", validateRequest(GetCardSchema), cardController.deleteCard);
cardRegistry.registerPath({
  method: "delete",
  path: "/api/cards/{id}",
  operationId: "deleteCard",
  description: "Delete a card by their ID",
  summary: "Delete Card",
  tags: ["Card"],
  request: { params: GetCardSchema.shape.params },
  responses: createApiResponses([
    {
      statusCode: StatusCodes.OK,
      description: "Card successfully deleted",
      schema: z.null(),
    },
    {
      statusCode: StatusCodes.BAD_REQUEST,
      description: "Invalid data supplied",
    },
    {
      statusCode: StatusCodes.NOT_FOUND,
      description: "Card not found",
    },
    {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      description: "An error occurred while deleting the card",
    },
  ]),
});
