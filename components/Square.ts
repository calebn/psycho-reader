import { ISquare } from "./ISquare";
import { Point } from "./IShape";
import { ShapeType } from "./ShapeType";

class Square implements ISquare {
  shapeType: ShapeType = ShapeType.Square;

  constructor(public length: number, public center: Point) {
    this.length = length;
    this.center = center;
  }
}
