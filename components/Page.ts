import Panel from "./Panel";

interface PageDimension {
  width: number;
  height: number;
}

interface Point {
  x: number;
  y: number;
}

interface PageOptions {
  imageUrl: string;
  panels: Panel[];
  currentPanel?: number;
  pageDimensions: PageDimension;
  center?: Point;
}

class Page {
  imageUrl: string;
  displayImage: string;
  panels: Panel[];
  currentPanel: number;
  pageDimensions: PageDimension;
  center?: Point;
  ref?: React.RefObject<HTMLCanvasElement>;

  constructor(options: PageOptions) {
    const { imageUrl, panels, pageDimensions, center } = options;
    this.imageUrl = imageUrl;
    this.displayImage = imageUrl;
    this.panels = panels;
    this.currentPanel = 0;
    this.pageDimensions = pageDimensions;
    this.center = center;
    if (this.center === undefined) {
      this.center = {
        x: this.pageDimensions.width / 2,
        y: this.pageDimensions.height / 2,
      };
    }
  }

  isOnPageImage() {
    return this.displayImage === this.imageUrl;
  }

  setDisplayImage(displayImage: string) {
    this.displayImage = displayImage;
  }

  nextImage() {
    if (this.isOnPageImage()) {
      this.setDisplayImage(this.panels[0].imageUrl);
    } else {
      this.goToNextPanel();
    }
  }

  prevImage() {
    if (this.currentPanel === 0) {
      this.setDisplayImage(this.imageUrl);
    } else {
      this.goToPrevPanel();
    }
  }

  hasPanels() {
    return this.panels.length > 0;
  }

  goToNextPanel() {
    if (this.hasNextPanel()) {
      this.nextPanel();
      this.setDisplayImage(this.panels[this.currentPanel].imageUrl);
    }
  }

  goToPrevPanel() {
    if (this.hasPrevPanel()) {
      this.prevPanel();
      this.setDisplayImage(this.panels[this.currentPanel].imageUrl);
    }
  }

  nextPanel() {
    if (this.currentPanel < this.panels.length - 1) this.currentPanel++;
  }

  hasNextPanel() {
    return this.currentPanel < this.panels.length - 1;
  }

  prevPanel() {
    if (this.currentPanel > 0) this.currentPanel--;
  }

  hasPrevPanel() {
    return this.currentPanel > 0;
  }

  setPanel(panelIdx: number) {
    if (this.panels[panelIdx] !== undefined) this.currentPanel = panelIdx;
  }

  getPanel(panelIdx: number) {
    if (this.panels[panelIdx] === undefined) return null;
    return this.panels[panelIdx];
  }

  getCurrentPanel() {
    return this.getPanel(this.currentPanel);
  }

  goToFirstPanel() {
    if (this.hasPanels()) this.setPanel(0);
  }

  goToLastPanel() {
    if (this.hasPanels()) this.setPanel(this.panels.length - 1);
  }
}

export default Page;
