import { z } from "zod";

export class ServiceResponse<T = null> {
  readonly success: boolean;
  readonly statusCode: number;
  readonly message: string;
  readonly responseObject: T;

  private constructor(success: boolean, statusCode: number, message: string, responseObject: T) {
    this.success = success;
    this.statusCode = statusCode;
    this.message = message;
    this.responseObject = responseObject;
  }

  static success<T>(statusCode: number, message: string, responseObject: T) {
    return new ServiceResponse(true, statusCode, message, responseObject);
  }

  static failure<T>(statusCode: number, message: string, responseObject: T) {
    return new ServiceResponse(false, statusCode, message, responseObject);
  }
}

export const ServiceResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    statusCode: z.number(),
    message: z.string(),
    responseObject: dataSchema.optional(),
  });
