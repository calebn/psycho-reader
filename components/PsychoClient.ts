import Book from "./Book";
import Page from "./Page";
import Panel from "./Panel";

export interface PsychoReaderClient {
  book: Book;
  dataSrc: string;
}

export function Client(config: PsychoReaderClient) {
  const { dataSrc, book } = config;
  const pages = book.pages.map((pageConfig: Page) => {
    const panels = pageConfig.panels.map((panelConfig: Panel) => {
      return new Panel({
        imageUrl: panelConfig.imageUrl,
        panelDimensions: panelConfig.panelDimensions,
        center: panelConfig.center,
        shape: panelConfig.shape,
        transitionIn: panelConfig.transitionIn,
        transitionOut: panelConfig.transitionOut,
      });
    });
    return new Page({
      imageUrl: pageConfig.imageUrl,
      panels: panels,
      currentPanel: pageConfig.currentPanel,
      pageDimensions: pageConfig.pageDimensions,
      center: pageConfig.center,
    });
  });
  let reader: PsychoReaderClient = { dataSrc: dataSrc, book: new Book(pages) };
  return reader;
}
