import { IShape } from "./IShape";
import { IPanel } from "./IConfig";
import { ShapeType } from "./ShapeType";
// import { Options } from "next/dist/server/base-server";

interface PanelDimension {
  width: number;
  height: number;
}

interface Point {
  x: number;
  y: number;
}

// interface PanelOptions {
//   panelDimensions: PanelDimension;
//   center?: Point;
//   shape?: IShape;
//   transitionIn?: Function;
//   transitionOut?: Function;
// }

class Panel {
  panelDimensions: PanelDimension;
  center: Point;
  shape: IShape;
  transitionIn?: Function;
  transitionOut?: Function;

  constructor(options: IPanel) {
  //   const {
  //     panelDimensions,
  //     center,
  //     shape,
  //     transitionIn,
  //     transitionOut,
  //   } = options;
  //   this.panelDimensions = panelDimensions;
  //   this.center = center;
  //   if (this.center === undefined) {
  //     this.center = {
  //       x: this.panelDimensions.width / 2,
  //       y: this.panelDimensions.height / 2,
  //     };
  //   }
  //   this.shape = shape;
  //   this.transitionIn = transitionIn;
  //   this.transitionOut = transitionOut;
  // }
  this.panelDimensions = {
    width: options.dimensions.w,
    height: options.dimensions.h
  }
  this.center = {
    x: options.center.x,
    y: options.center.y
  }

  this.shape = {
    shapeType: ShapeType[options.shape as keyof typeof ShapeType]
  }
  this.transitionIn = function() { console.log('transitionIn') }
  this.transitionOut = function() { console.log('transitionOu') }
}
}

export default Panel;
