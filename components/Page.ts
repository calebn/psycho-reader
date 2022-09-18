import Panel from "./Panel";

interface PageDimension {
  height: number;
  width: number;
}

class Page {
  imageUrl: string;
  panels: Panel[];
  currentPanel: number;
  pageDimensions: PageDimension;

  constructor(
    imageUrl: string,
    panels: Panel[],
    pageDimensions: PageDimension
  ) {
    this.imageUrl = imageUrl;
    this.panels = panels;
    this.currentPanel = 0;
    this.pageDimensions = pageDimensions;
  }

  nextPanel() {
    if (this.currentPanel < this.panels.length - 1) this.currentPanel++;
  }

  prevPanel() {
    if (this.currentPanel > 0) this.currentPanel--;
  }

  setPanel(panel: number) {
    if (this.panels[panel] !== undefined) this.currentPanel = panel;
  }
}

export default Page;
