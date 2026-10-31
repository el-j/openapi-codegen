import { isStringLiteral } from "typescript/ast";
import type { Expression } from "typescript/ast";

export function getText(expression: Expression) {
  if (!isStringLiteral(expression)) {
    throw new TypeError("Expected a string literal module specifier");
  }
  return expression.text;
}
