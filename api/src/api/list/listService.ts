import { StatusCodes } from "http-status-codes";

import type { List } from "../../../prisma/generated/prisma/client";
import { ListRepository } from "@/api/list/listRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

export class ListService {
  private listRepository: ListRepository;

  constructor(repository: ListRepository = new ListRepository()) {
    this.listRepository = repository;
  }

  async create(data: List): Promise<ServiceResponse<List | null>> {
    try {
      const list: List = await this.listRepository.create(data);
      return ServiceResponse.success<List>(StatusCodes.CREATED, "List successfully created", list);
    } catch (ex) {
      const errorMessage = `Error while creating a list: ${(ex as Error).message}.\n${JSON.stringify(data)}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "An error occurred while creating the list",
        null,
      );
    }
  }

  async findAll(): Promise<ServiceResponse<List[] | null>> {
    try {
      const lists = await this.listRepository.findAll();
      if (!lists || lists.length === 0) {
        return ServiceResponse.failure<List[]>(StatusCodes.NOT_FOUND, "No Lists found", lists);
      }
      return ServiceResponse.success<List[]>(StatusCodes.OK, "Lists successfully found", lists);
    } catch (ex) {
      const errorMessage = `Error finding all lists: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "An error occurred while retrieving lists",
        null,
      );
    }
  }

  async findById(id: number): Promise<ServiceResponse<List | null>> {
    try {
      if (Number.isNaN(id)) {
        return ServiceResponse.failure(
          StatusCodes.BAD_REQUEST,
          "Invalid data supplied: id: ID must be a numeric value, id: ID must be a positive number",
          null,
        );
      }

      const list = await this.listRepository.findById(id);
      if (!list) {
        return ServiceResponse.failure(StatusCodes.NOT_FOUND, "List not found", null);
      }
      return ServiceResponse.success<List>(StatusCodes.OK, "List successfully found", list);
    } catch (ex) {
      const errorMessage = `Error finding list with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(StatusCodes.INTERNAL_SERVER_ERROR, "An error occurred while finding list", null);
    }
  }

  async update(id: number, data: List): Promise<ServiceResponse<null>> {
    try {
      if (Number.isNaN(id)) {
        return ServiceResponse.failure(
          StatusCodes.BAD_REQUEST,
          "Invalid data supplied: id: ID must be a numeric value, id: ID must be a positive number",
          null,
        );
      }

      const list = await this.listRepository.findById(id);
      if (!list) {
        return ServiceResponse.failure(StatusCodes.NOT_FOUND, "List not found", null);
      }

      await this.listRepository.update(id, data);
      return ServiceResponse.success(StatusCodes.OK, "List successfully updated", null);
    } catch (ex) {
      const errorMessage = `Error while updating the list with id ${id} and their new data ${JSON.stringify(data)}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "An error occurred while updating the list",
        null,
      );
    }
  }

  async delete(id: number): Promise<ServiceResponse<List | null>> {
    try {
      if (Number.isNaN(id)) {
        return ServiceResponse.failure(
          StatusCodes.BAD_REQUEST,
          "Invalid data supplied: id: ID must be a numeric value, id: ID must be a positive number",
          null,
        );
      }

      const list = await this.listRepository.findById(id);
      if (!list) {
        return ServiceResponse.failure(StatusCodes.NOT_FOUND, "List not found", null);
      }

      await this.listRepository.delete(id);
      return ServiceResponse.success(StatusCodes.OK, "List successfully deleted", list);
    } catch (ex) {
      const errorMessage = `Error while deleting the list with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "An error occurred while deleting the list",
        null,
      );
    }
  }
}

export const listService = new ListService();
