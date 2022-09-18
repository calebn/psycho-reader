import PsychoReader from "../components/PsychoReader";
import Book from "../components/Book";
// import PsyReader from "../src/PsyReader";
// import Book from "../src/Book";

describe("PsychoReader", () => {
  test("Is PsychoReader defined", async () => {
    const psyReader = await PsychoReader();
    expect(psyReader).toBeDefined();
  });

  test("Is book property is defined and a Book class", async () => {
    const psyReader = await PsychoReader();
    expect(psyReader.book).toBeDefined();
    expect(psyReader.book).toBeInstanceOf(Book);
  });

  test("Is buildBook property a function", async () => {
    const psyReader = await PsychoReader();
    expect(typeof psyReader.buildBook).toBe("function");
  });

  test("Is loadFiles property a function", async () => {
    const psyReader = await PsychoReader();
    expect(typeof psyReader.loadFiles).toBe("function");
  });

  test("Is buildPanelsForPage property a function", async () => {
    const psyReader = await PsychoReader();
    expect(typeof psyReader.buildPanelsForPage).toBe("function");
  });

  test("Is buildPages property a function", async () => {
    const psyReader = await PsychoReader();
    expect(typeof psyReader.buildPages).toBe("function");
  });

  test("Is buildBook property a function", async () => {
    const psyReader = await PsychoReader();
    expect(typeof psyReader.buildBook).toBe("function");
  });

  test("Is getParentDirFromBasepath property a function", async () => {
    const psyReader = await PsychoReader();
    expect(typeof psyReader.getParentDirFromBasepath).toBe("function");
  });
});
