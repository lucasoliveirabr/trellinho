import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../../prisma/generated/prisma/client";
import type { Card } from "../../../prisma/generated/prisma/client";
import { env } from "@/common/utils/envConfig";

const connectionString = `${env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export class CardRepository {
  async create({ name, description, status, id_list }: Card): Promise<Card> {
    return await prisma.$queryRaw`INSERT INTO "cards" ("name", "description", "status", "id_list") VALUES (${name}, ${description}, ${status}, ${id_list})`;
  }

  async findAll(): Promise<Card[]> {
    return await prisma.$queryRaw`SELECT * from "cards"`;
  }

  async findById(id: number): Promise<Card | null> {
    const result = await prisma.$queryRaw<Card[]>`SELECT * from "cards" WHERE id = ${id}`;
    return result[0];
  }

  async update(id: number, { name, description, status, id_list }: Card): Promise<Card> {
    return await prisma.$queryRaw`UPDATE "cards" SET "name" = ${name}, "description" = ${description}, "status" = ${status}, "id_list" = ${id_list} WHERE id = ${id}`;
  }

  async delete(id: number) {
    return await prisma.$queryRaw`DELETE FROM "cards" WHERE id = ${id}`;
  }
}
