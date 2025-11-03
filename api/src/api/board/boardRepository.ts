import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../../prisma/generated/prisma/client";
import type { Board } from "../../../prisma/generated/prisma/client";
import { env } from "@/common/utils/envConfig";

const connectionString = `${env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export class BoardRepository {
  async create({ name }: Board): Promise<Board> {
    return await prisma.$queryRaw`INSERT INTO "boards" ("name") VALUES (${name})`;
  }

  async findAll(): Promise<Board[]> {
    return await prisma.$queryRaw`
      SELECT
        b.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', l.id,
              'name', l.name,
              'id_board', l.id_board,
              'cards', COALESCE(
                (
                  SELECT json_agg(
                    json_build_object(
                      'id', c.id,
                      'name', c.name,
                      'description', c.description,
                      'status', c.status,
                      'id_list', c.id_list
                    )
                  )
                  FROM "cards" c
                  WHERE c.id_list = l.id
                ),
                '[]'::json
              )
            )
          ) FILTER (WHERE l.id IS NOT NULL),
          '[]'::json
        ) AS lists
      FROM "boards" b
      LEFT JOIN "lists" l ON l.id_board = b.id
      GROUP BY b.id
      ORDER BY b.id;
    `;
  }

  async findById(id: number): Promise<Board | null> {
    const result = await prisma.$queryRaw<Board[]>`SELECT * from "boards" WHERE id = ${id}`;
    return result[0];
  }

  async update(id: number, { name }: Board): Promise<Board> {
    return await prisma.$queryRaw`UPDATE "boards" SET "name" = ${name} WHERE id = ${id}`;
  }

  async delete(id: number) {
    return await prisma.$queryRaw`DELETE FROM "boards" WHERE id = ${id}`;
  }
}
