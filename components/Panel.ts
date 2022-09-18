import { IShape } from "./IShape";

class Panel {
  imageUrl: string;
  shape?: IShape;
  height?: number;
  width?: number;
  center?: number;
  transitionIn?: Function;
  transitionOut?: Function;

  constructor(
    imageUrl: string,
    shape?: IShape,
    height?: number,
    width?: number,
    center?: number,
    transitionIn?: Function,
    transitionOut?: Function
  ) {
    this.imageUrl = imageUrl;
    this.shape = shape;
    this.height = height;
    this.width = width;
    this.center = center;
    this.transitionIn = transitionIn;
    this.transitionOut = transitionOut;
  }
}

export default Panel;
