import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../../prisma/generated/prisma/client";
import type { List } from "../../../prisma/generated/prisma/client";
import { env } from "@/common/utils/envConfig";

const connectionString = `${env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export class ListRepository {
  async create({ name, id_board }: List): Promise<List> {
    return await prisma.$queryRaw`INSERT INTO "lists" ("name", "id_board") VALUES (${name}, ${id_board})`;
  }

  async findAll(): Promise<List[]> {
    return await prisma.$queryRaw`
      SELECT
        l.*,
        COALESCE(
          json_agg(c.*) FILTER (WHERE c.id IS NOT NULL),
          '[]'
        ) AS cards
      FROM "lists" l
      LEFT JOIN "cards" c ON c."id_list" = l.id
      GROUP BY l.id
      ORDER BY l.id
    `;
  }

  async findById(id: number): Promise<List | null> {
    const result = await prisma.$queryRaw<List[]>`SELECT * from "lists" WHERE id = ${id}`;
    return result[0];
  }

  async update(id: number, { name, id_board }: List): Promise<List> {
    return await prisma.$queryRaw`UPDATE "lists" SET "name" = ${name}, "id_board" = ${id_board} WHERE id = ${id}`;
  }

  async delete(id: number) {
    return await prisma.$queryRaw`DELETE FROM "lists" WHERE id = ${id}`;
  }
}
