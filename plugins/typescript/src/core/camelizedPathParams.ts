import { camel } from "../utils/case-interop";

/**
 * Transform url params case to camel.
 *
 * @example
 * `pet/{pet_id}` -> `pet/{petId}`
 */
export const camelizedPathParams = (url: string) =>
  url.replace(/\{[\w\d\-_.]*\}/g, (match) => `{${camel(match)}}`);
