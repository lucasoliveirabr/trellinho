import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export const cardValidations = {
  name: z.string().max(15),
  description: z.string().max(50),
  status: z.string(),
  id_board: z.number().int().positive(),
};

const { id, createdAt, updatedAt, deletedAt } = commonValidations;
const { name, description, status, id_board } = cardValidations;

export const CardSchema = z.object({
  id,
  name,
  description,
  status,
  id_board,
  createdAt,
  updatedAt,
  deletedAt,
});

export const CreateCardSchema = z.object({
  body: z.object({
    name,
    description,
    status,
    id_board,
    createdAt,
    updatedAt,
    deletedAt,
  }),
});

export const GetCardSchema = z.object({
  params: z.object({ id }),
});

export const UpdateCardSchema = z.object({
  params: z.object({ id }),
  body: z.object({
    name,
    description,
    status,
    id_board,
  }),
});
