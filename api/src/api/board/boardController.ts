import type { Request, RequestHandler, Response } from "express";

import { boardService } from "@/api/board/boardService";

class BoardController {
  public createBoard: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await boardService.create(req.body);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public getBoards: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await boardService.findAll();
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public getBoard: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id, 10);
    const serviceResponse = await boardService.findById(id);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public updateBoard: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id, 10);
    const serviceResponse = await boardService.update(id, req.body);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public deleteBoard: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id, 10);
    const serviceResponse = await boardService.delete(id);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };
}

export const boardController = new BoardController();
