import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export const boardValidations = {
  name: z.string().max(15),
};

const { id, createdAt, updatedAt, deletedAt } = commonValidations;
const { name } = boardValidations;

export const BoardSchema = z.object({
  id,
  name,
  createdAt,
  updatedAt,
  deletedAt,
});

export const CreateBoardSchema = z.object({
  body: z.object({
    name,
    createdAt,
    updatedAt,
    deletedAt,
  }),
});

export const GetBoardSchema = z.object({
  params: z.object({ id }),
});

export const UpdateBoardSchema = z.object({
  params: z.object({ id }),
  body: z.object({
    name,
  }),
});
