import * as ts from "typescript";

export type Transformer = Required<
  Pick<ts.CustomTransformers, "before" | "afterDeclarations">
>;
export type TransformerNode = ts.Bundle | ts.SourceFile;

export interface ITransformerOptions {}
