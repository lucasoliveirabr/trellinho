import type { Request, RequestHandler, Response } from "express";

import { cardService } from "@/api/card/cardService";

class CardController {
  public createCard: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await cardService.create(req.body);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public getCards: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await cardService.findAll();
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public getCard: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id, 10);
    const serviceResponse = await cardService.findById(id);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public updateCard: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id, 10);
    const serviceResponse = await cardService.update(id, req.body);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public deleteCard: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id, 10);
    const serviceResponse = await cardService.delete(id);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };
}

export const cardController = new CardController();
