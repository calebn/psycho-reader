import { IShape } from "./IShape";

interface PanelDimension {
  width: number;
  height: number;
}

interface Point {
  x: number;
  y: number;
}

interface PanelOptions {
  imageUrl: string;
  panelDimensions: PanelDimension;
  center?: Point;
  shape?: IShape;
  transitionIn?: Function;
  transitionOut?: Function;
}

class Panel {
  imageUrl: string;
  panelDimensions: PanelDimension;
  center?: Point;
  shape?: IShape;
  transitionIn?: Function;
  transitionOut?: Function;

  constructor(options: PanelOptions) {
    const {
      imageUrl,
      panelDimensions,
      center,
      shape,
      transitionIn,
      transitionOut,
    } = options;
    this.imageUrl = imageUrl;
    this.panelDimensions = panelDimensions;
    this.center = center;
    if (this.center === undefined) {
      this.center = {
        x: this.panelDimensions.width / 2,
        y: this.panelDimensions.height / 2,
      };
    }
    this.shape = shape;
    this.transitionIn = transitionIn;
    this.transitionOut = transitionOut;
  }
}

export default Panel;
