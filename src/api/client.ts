// 此文件由 pnpm gen:api 生成，禁止手改。

import type { operations } from "./schema";
import { http } from "@/utils/http";

type Content<T> = T extends { content: infer C }
  ? C extends { "application/json": infer J }
    ? J
    : C[keyof C]
  : void;
export type OperationBody<K extends keyof operations> = operations[K] extends {
  requestBody?: infer B;
}
  ? Content<NonNullable<B>>
  : never;
export type OperationParameter<
  K extends keyof operations,
  P extends string
> = operations[K] extends { parameters: infer V }
  ? P extends keyof V
    ? V[P]
    : never
  : never;
export type OperationResponse<K extends keyof operations> =
  operations[K] extends { responses: infer R }
    ? Content<
        R[Extract<
          keyof R,
          | 200
          | 201
          | 202
          | 203
          | 204
          | 205
          | 206
          | "200"
          | "201"
          | "202"
          | "204"
        >]
      >
    : never;
export type OperationInput<K extends keyof operations> = {
  body?: OperationBody<K>;
  path?: OperationParameter<K, "path">;
  query?: OperationParameter<K, "query">;
  headers?: OperationParameter<K, "header">;
};

export function createApiClient(
  transport: Pick<typeof http, "request"> = http
) {
  void transport;
  return {};
}
export const api = createApiClient();
