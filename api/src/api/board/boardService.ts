import { StatusCodes } from "http-status-codes";

import type { Board } from "../../../prisma/generated/prisma/client";
import { BoardRepository } from "@/api/board/boardRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

export class BoardService {
  private boardRepository: BoardRepository;

  constructor(repository: BoardRepository = new BoardRepository()) {
    this.boardRepository = repository;
  }

  async create(data: Board): Promise<ServiceResponse<Board | null>> {
    try {
      const board: Board = await this.boardRepository.create(data);
      return ServiceResponse.success<Board>(StatusCodes.CREATED, "Board successfully created", board);
    } catch (ex) {
      const errorMessage = `Error while creating a board: ${(ex as Error).message}.\n${JSON.stringify(data)}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "An error occurred while creating the board",
        null,
      );
    }
  }

  async findAll(): Promise<ServiceResponse<Board[] | null>> {
    try {
      const boards = await this.boardRepository.findAll();
      if (!boards || boards.length === 0) {
        return ServiceResponse.failure<Board[]>(StatusCodes.NOT_FOUND, "No Boards found", boards);
      }
      return ServiceResponse.success<Board[]>(StatusCodes.OK, "Boards successfully found", boards);
    } catch (ex) {
      const errorMessage = `Error finding all boards: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "An error occurred while retrieving boards",
        null,
      );
    }
  }

  async findById(id: number): Promise<ServiceResponse<Board | null>> {
    try {
      if (Number.isNaN(id)) {
        return ServiceResponse.failure(
          StatusCodes.BAD_REQUEST,
          "Invalid data supplied: id: ID must be a numeric value, id: ID must be a positive number",
          null,
        );
      }

      const board = await this.boardRepository.findById(id);
      if (!board) {
        return ServiceResponse.failure(StatusCodes.NOT_FOUND, "Board not found", null);
      }
      return ServiceResponse.success<Board>(StatusCodes.OK, "Board successfully found", board);
    } catch (ex) {
      const errorMessage = `Error finding board with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(StatusCodes.INTERNAL_SERVER_ERROR, "An error occurred while finding board", null);
    }
  }

  async update(id: number, data: Board): Promise<ServiceResponse<null>> {
    try {
      if (Number.isNaN(id)) {
        return ServiceResponse.failure(
          StatusCodes.BAD_REQUEST,
          "Invalid data supplied: id: ID must be a numeric value, id: ID must be a positive number",
          null,
        );
      }

      const board = await this.boardRepository.findById(id);
      if (!board) {
        return ServiceResponse.failure(StatusCodes.NOT_FOUND, "Board not found", null);
      }

      await this.boardRepository.update(id, data);
      return ServiceResponse.success(StatusCodes.OK, "Board successfully updated", null);
    } catch (ex) {
      const errorMessage = `Error while updating the board with id ${id} and their new data ${JSON.stringify(data)}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "An error occurred while updating the board",
        null,
      );
    }
  }

  async delete(id: number): Promise<ServiceResponse<Board | null>> {
    try {
      if (Number.isNaN(id)) {
        return ServiceResponse.failure(
          StatusCodes.BAD_REQUEST,
          "Invalid data supplied: id: ID must be a numeric value, id: ID must be a positive number",
          null,
        );
      }

      const board = await this.boardRepository.findById(id);
      if (!board) {
        return ServiceResponse.failure(StatusCodes.NOT_FOUND, "Board not found", null);
      }

      await this.boardRepository.delete(id);
      return ServiceResponse.success(StatusCodes.OK, "Board successfully deleted", board);
    } catch (ex) {
      const errorMessage = `Error while deleting the board with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "An error occurred while deleting the board",
        null,
      );
    }
  }
}

export const boardService = new BoardService();
