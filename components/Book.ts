import Page from "./Page";

class Book {
  pages: Page[];
  currentPage: number;

  constructor(pages: Page[]) {
    this.pages = pages;
    this.currentPage = 0;
  }

  nextPage() {
    if (this.currentPage < this.pages.length - 1) this.currentPage++;
  }

  prevPage() {
    if (this.currentPage > 0) this.currentPage--;
  }

  setPage(page: number) {
    if (this.pages[page] !== undefined) this.currentPage = page;
  }
}

export default Book;
