import { StatusCodes } from "http-status-codes";

import type { Card } from "../../../prisma/generated/prisma/client";
import { CardRepository } from "@/api/card/cardRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

export class CardService {
  private cardRepository: CardRepository;

  constructor(repository: CardRepository = new CardRepository()) {
    this.cardRepository = repository;
  }

  async create(data: Card): Promise<ServiceResponse<Card | null>> {
    try {
      const card: Card = await this.cardRepository.create(data);
      return ServiceResponse.success<Card>(StatusCodes.CREATED, "Card successfully created", card);
    } catch (ex) {
      const errorMessage = `Error while creating a card: ${(ex as Error).message}.\n${JSON.stringify(data)}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "An error occurred while creating the card",
        null,
      );
    }
  }

  async findAll(): Promise<ServiceResponse<Card[] | null>> {
    try {
      const cards = await this.cardRepository.findAll();
      if (!cards || cards.length === 0) {
        return ServiceResponse.failure<Card[]>(StatusCodes.NOT_FOUND, "No Cards found", cards);
      }
      return ServiceResponse.success<Card[]>(StatusCodes.OK, "Cards successfully found", cards);
    } catch (ex) {
      const errorMessage = `Error finding all cards: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "An error occurred while retrieving cards",
        null,
      );
    }
  }

  async findById(id: number): Promise<ServiceResponse<Card | null>> {
    try {
      if (Number.isNaN(id)) {
        return ServiceResponse.failure(
          StatusCodes.BAD_REQUEST,
          "Invalid data supplied: id: ID must be a numeric value, id: ID must be a positive number",
          null,
        );
      }

      const card = await this.cardRepository.findById(id);
      if (!card) {
        return ServiceResponse.failure(StatusCodes.NOT_FOUND, "Card not found", null);
      }
      return ServiceResponse.success<Card>(StatusCodes.OK, "Card successfully found", card);
    } catch (ex) {
      const errorMessage = `Error finding card with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(StatusCodes.INTERNAL_SERVER_ERROR, "An error occurred while finding card", null);
    }
  }

  async update(id: number, data: Card): Promise<ServiceResponse<null>> {
    try {
      if (Number.isNaN(id)) {
        return ServiceResponse.failure(
          StatusCodes.BAD_REQUEST,
          "Invalid data supplied: id: ID must be a numeric value, id: ID must be a positive number",
          null,
        );
      }

      const card = await this.cardRepository.findById(id);
      if (!card) {
        return ServiceResponse.failure(StatusCodes.NOT_FOUND, "Card not found", null);
      }

      await this.cardRepository.update(id, data);
      return ServiceResponse.success(StatusCodes.OK, "Card successfully updated", null);
    } catch (ex) {
      const errorMessage = `Error while updating the card with id ${id} and their new data ${JSON.stringify(data)}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "An error occurred while updating the card",
        null,
      );
    }
  }

  async delete(id: number): Promise<ServiceResponse<Card | null>> {
    try {
      if (Number.isNaN(id)) {
        return ServiceResponse.failure(
          StatusCodes.BAD_REQUEST,
          "Invalid data supplied: id: ID must be a numeric value, id: ID must be a positive number",
          null,
        );
      }

      const card = await this.cardRepository.findById(id);
      if (!card) {
        return ServiceResponse.failure(StatusCodes.NOT_FOUND, "Card not found", null);
      }

      await this.cardRepository.delete(id);
      return ServiceResponse.success(StatusCodes.OK, "Card successfully deleted", card);
    } catch (ex) {
      const errorMessage = `Error while deleting the card with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "An error occurred while deleting the card",
        null,
      );
    }
  }
}

export const cardService = new CardService();
