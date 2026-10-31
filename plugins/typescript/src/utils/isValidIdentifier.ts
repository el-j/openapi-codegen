import {
  LanguageVariant,
  SyntaxKind,
  createScanner,
} from "typescript/ast";

export function isValidIdentifier(name: string): boolean {
  if (!name || name.length === 0) {
    return false;
  }

  const scanner = createScanner(false, LanguageVariant.Standard, name);

  const token = scanner.scan();
  if (
    token !== SyntaxKind.Identifier &&
    !(scanner.isIdentifier() && !scanner.isReservedWord())
  ) {
    return false;
  }

  const end = scanner.getTokenStart() + scanner.getTokenText().length;
  return end === name.length;
}
