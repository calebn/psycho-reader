import { IShape } from "./IShape";
import { ShapeType } from "./ShapeType";

export interface IRectangle extends IShape {
  length: number;
  width: number;
}
