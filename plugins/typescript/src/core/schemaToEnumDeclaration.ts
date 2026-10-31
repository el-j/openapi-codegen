import { pascal } from "../utils/case-interop";
import { SchemaObject } from "openapi3-ts/oas30";
import * as ts from "typescript/ast";
import * as f from "typescript/ast/factory";
import { convertNumberToWord } from "../utils/getEnumProperties";
import { isValidIdentifier } from "../utils/isValidIdentifier";
import { Context, getJSDocComment } from "./schemaToTypeAliasDeclaration";

/**
 * Add Enum support when transforming an OpenAPI Schema Object to Typescript Nodes.
 *
 * @param name Name of the schema
 * @param schema OpenAPI Schema object
 * @param context Context
 */
export const schemaToEnumDeclaration = (
  name: string,
  schema: SchemaObject,
  context: Context
): ts.Node[] => {
  const jsDocNode = getJSDocComment(schema, context);
  const members = getEnumMembers(schema);
  const declarationNode = f.createEnumDeclaration(
    [f.createToken(ts.SyntaxKind.ExportKeyword)],
    f.createIdentifier(pascal(name)),
    members
  );

  return jsDocNode ? [jsDocNode, declarationNode] : [declarationNode];
};

function getEnumMembers(schema: SchemaObject): ts.EnumMember[] {
  if (!schema.enum || !Array.isArray(schema.enum)) {
    throw new Error(
      "The provided schema does not have an 'enum' property or it is not an array."
    );
  }

  const SKIP = Symbol("SKIP");

  return schema.enum
    .map((enumValue) => {
      let enumName: string;
      let enumValueNode: ts.Expression | undefined = undefined;

      if (typeof enumValue === "string") {
        if (String(Number(enumValue)) === enumValue) {
          enumName = convertNumberToWord(Number(enumValue));
        } else {
          enumName = enumValue;
        }
        enumValueNode = f.createStringLiteral(enumValue, 0);
      } else if (typeof enumValue === "number") {
        enumName = convertNumberToWord(enumValue)
          .toUpperCase()
          .replace(/[-\s]/g, "_");
        enumValueNode = f.createNumericLiteral(String(enumValue), 0);
      } else if (typeof enumValue === "boolean") {
        enumName = enumValue ? "True" : "False";
      } else if (enumValue === null) {
        // null values are added at the end of the enum when dealing with `nullable: true`
        return SKIP;
      } else {
        throw new Error(`Unsupported enum value type: ${typeof enumValue}`);
      }

      enumName = pascal(enumName);
      return f.createEnumMember(
        isValidIdentifier(enumName)
          ? f.createIdentifier(enumName)
          : f.createStringLiteral(`${enumValue}`, 0),
        enumValueNode
      );
    })
    .filter((enumValue) => enumValue !== SKIP);
}
