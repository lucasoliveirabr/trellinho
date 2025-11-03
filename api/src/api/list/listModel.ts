import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export const listValidations = {
  name: z.string().max(15),
  id_board: z.number().int().positive(),
};

const { id, createdAt, updatedAt, deletedAt } = commonValidations;
const { name, id_board } = listValidations;

export const ListSchema = z.object({
  id,
  name,
  id_board,
  createdAt,
  updatedAt,
  deletedAt,
});

export const CreateListSchema = z.object({
  body: z.object({
    name,
    id_board,
    createdAt,
    updatedAt,
    deletedAt,
  }),
});

export const GetListSchema = z.object({
  params: z.object({ id }),
});

export const UpdateListSchema = z.object({
  params: z.object({ id }),
  body: z.object({
    name,
    id_board,
  }),
});
