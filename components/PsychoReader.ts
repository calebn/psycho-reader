import { existsSync } from "fs";
import { readdir, stat } from "fs/promises";
import * as path from "path";
import Book from "./Book";
import Page from "./Page";
import Panel from "./Panel";

import sizeOf from "image-size";

/**
 * Simple object definition for grouping
 * image filepaths for a Page object
 *
 * @param page string|undefined
 * @param panels string[]
 */
interface IFileLoad {
  page?: string;
  panels: string[];
}

export class PsyReader {
  book?: Book;
  dataSrc: string;

  constructor(dataSrc: string) {
    this.dataSrc = dataSrc;
  }

  //traverse dir for panel images where the parent dir is the Page and
  //each image in the curent dir is the Panel image
  loadBook = async () => {
    const files = await this.loadFiles(this.dataSrc);
    const pages = this.buildPages(files);
    return this.buildBook(pages);
  };

  //recursive walk for files
  loadFiles = async (dir: string, results: IFileLoad[] = []) => {
    const subdirs: string[] = await readdir(dir);
    await Promise.all(
      subdirs.map(async (file) => {
        const filePath = path.join(dir, file);
        const stats = await stat(filePath);
        if (stats.isDirectory()) return this.loadFiles(filePath, results);
        if (stats.isFile()) {
          const parts = path.parse(filePath);
          const parentDir = this.getParentDirFromBasepath(filePath);
          if (parentDir === "panels") {
            //find the page number ad index into results array and append
            const pageNum = this.getParentDirFromBasepath(
              filePath.replace(path.join(path.sep, parts.base), "")
            );
            if (results[parseInt(pageNum)] === undefined) {
              results[parseInt(pageNum)] = { panels: [] };
            }
            results[parseInt(pageNum)].panels.push(
              path.join(path.sep, filePath.replace("public/", ""))
            );
          } else {
            //paretnDir is the page number already so append the page image
            results[parseInt(parentDir)] = {
              page: path.join(path.sep, filePath.replace("public/", "")),
              panels: [],
            };
          }
        }
      })
    );
    return results;
  };

  //returns a bunch of panels
  buildPanelsForPage = (files: string[]) => {
    return files.map((filePath) => {
      if (filePath === undefined) throw Error("Missing panel url");
      const dimensions = sizeOf(path.join("public", filePath));
      if (dimensions.width === undefined || dimensions.height === undefined)
        throw new Error(`Cannot determine image dimensions`);
      return new Panel({
        imageUrl: filePath,
        panelDimensions: {
          width: dimensions.width,
          height: dimensions.height,
        },
      });
    });
  };

  //returns a bunch of pages
  buildPages = (files: IFileLoad[]) => {
    return files.map(({ page, panels }) => {
      if (page === undefined) throw Error("Missing page url");
      const dimensions = sizeOf(path.join("public", page));
      if (dimensions.width === undefined || dimensions.height === undefined)
        throw new Error(`Cannot determine image dimensions`);
      return new Page({
        imageUrl: page,
        panels: this.buildPanelsForPage(panels),
        pageDimensions: {
          width: dimensions.width,
          height: dimensions.height,
        },
      });
    });
  };

  //a book
  buildBook = (pages: Page[]) => {
    return new Book(pages);
  };

  //helper to determine the parent directory for
  //identifying a panels from pages
  getParentDirFromBasepath = (filePath: string) => {
    const dir = path.parse(filePath).dir;
    const reg = /[\w]+$/;
    const match = dir.match(reg);
    if (match === null) throw Error("Invalid Path");
    return match[0];
  };
}

export interface IPsychoReaderConfig {
  book?: Book;
  dataSrc: string;
}

//factory method for a getting a PsychoReaderType
//allows us to use async to build the book object
//usage: const reader: PsychoReaderType = await PsychoReader();
export default async function PsychoReaderConfig(dataSrc?: string) {
  if (dataSrc === undefined && process.env.PSYCHOREADER_PATH !== undefined) {
    dataSrc = process.env.PSYCHOREADER_PATH; // relative path
  }
  if (dataSrc === undefined) {
    throw Error("Environment variable PSYCHO_READER_PATH is undefined");
  }
  if (!existsSync(dataSrc)) {
    throw Error("Invalid data source path");
  }
  let reader = new PsyReader(dataSrc);
  reader.book = await reader.loadBook();
  return reader;
}
