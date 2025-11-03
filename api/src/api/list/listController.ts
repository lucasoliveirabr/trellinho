import type { Request, RequestHandler, Response } from "express";

import { listService } from "@/api/list/listService";

class ListController {
  public createList: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await listService.create(req.body);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public getLists: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await listService.findAll();
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public getList: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id, 10);
    const serviceResponse = await listService.findById(id);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public updateList: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id, 10);
    const serviceResponse = await listService.update(id, req.body);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public deleteList: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id, 10);
    const serviceResponse = await listService.delete(id);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };
}

export const listController = new ListController();
