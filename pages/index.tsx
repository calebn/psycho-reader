import { InferGetServerSidePropsType } from "next";
import Swiper from "swiper";
import { Swiper as SwiperElement, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import Head from "next/head";
import Page from "../components/Page";
import PsychoReaderConfig, {
  IPsychoReaderConfig,
} from "../components/PsychoReader";
import { Client } from "../components/PsychoClient";
import styles from "../styles/Home.module.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Canvas from "../components/Canvas";
import Book from "../components/Book";
import { createRef, useEffect, useRef } from "react";
import { IConfig } from "../components/IConfig";
import { useState } from "react";

export async function getServerSideProps() {
  const readerConfig: IConfig = await PsychoReaderConfig();
  return {
    props: {
      psychoReaderConfig: JSON.parse(JSON.stringify(readerConfig)),
    },
  };
}

/**
 * @todo A user should be able to click/touch on a page image to see the image
 *       in greater detail. Implement zoom on click/touch functionality. Should
 *       be simple enough.
 * 
 * @todo Implement window resize handling
 *
 * @todo When going from full page view and swiping to the next panel, the
 *       experience should be the panel animates off the page from its
 *       location/coordiantes and is now it's the primary view.
 *       - Sequence
 *        1. On swipe begins the animation
 *        2. The exit animation should shrink the canvas back to the orignal
 *           size and location on the page image behind it
 */
const Home = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { psychoReaderConfig } = props;
  const psychoClient = Client(psychoReaderConfig);

  const canvasRefs = useRef<Array<HTMLCanvasElement | null>>([]);

  useEffect(() => {
    console.log(`canvasRefs `, canvasRefs);
    canvasRefs.current = canvasRefs.current.slice(
      0,
      psychoClient.book.pages.length
    );
  }, [psychoClient]);

  // allow a slide to change when there are no panels
  // (cover or inside page) or when we're at the last
  // panel of a page that is not the last page
  // need a way to detect the direction next/previous
  const handleOnSlideChange = (swiper: Swiper, { book }: { book: Book }) => {
    const dir =
      swiper.realIndex > swiper.previousIndex ||
      swiper.previousIndex === undefined
        ? "next"
        : "prev";
    console.log(`dir: ${dir}`);
    if (dir === "next") {
      handleOnNext(swiper, book);
    } else {
      handleOnPrev(swiper, book);
    }
  };

  const handleOnNext = (swiper: Swiper, book: Book) => {
    console.log("handleOnNext");
    const currentPage = book.getCurrentPage();
    if (currentPage.hasNextPanel()) {
      console.log(`currentPage ${book.currentPage} has another panel`);
      currentPage.nextPanel();
      console.log(`current panel is now ${currentPage.getCurrentPanel()}`);
    } else if (book.hasNextPage()) {
      console.log(
        `currentPage ${book.currentPage} has no panels or none left so we're going to the Next Page`
      );
      book.nextPage();
    }
  };
  const handleOnPrev = (swiper: Swiper, book: Book) => {
    console.log("handleOnPrev");
    const currentPage = book.getCurrentPage();
    if (currentPage.hasPrevPanel()) {
      console.log(`currentPage ${book.currentPage} has previous panel`);
      currentPage.prevPanel();
      console.log(`current panel is now ${currentPage.getCurrentPanel()}`);
    } else if (book.hasPrevPage()) {
      console.log(
        `currentPage has no previous panels left so we're going to the Previous Page`
      );
      book.prevPage();
    }
  };

  const handleOnSlideChangeEnd = (swiper: Swiper, { book }: { book: Book }) => {
    //sometimes swiper.swipeDirection is undefined so we can determine a dir this way
    const dir =
      swiper.realIndex > swiper.previousIndex ||
      swiper.previousIndex === undefined
        ? "next"
        : "prev";
    if (dir === "next") {
      handleOnNextEnd(swiper, book);
    } else {
      handleOnPrevEnd(swiper, book);
    }
  };

  const handleOnNextEnd = (swiper: Swiper, book: Book) => {
    book.goToNext();
    console.log(
      `current page is ${book.currentPage} and displayImage is ${
        book.getCurrentPage().displayImage
      }`
    );
    console.log("handleOnNextEnd");
    const currentPage = book.getCurrentPage();
    if (currentPage.hasNextPanel()) {
      console.log(
        `new currentPage ${book.currentPage} has next panel(s). allowSlideNext=false`
      );
      swiper.allowSlideNext = false;
    } else if (book.hasNextPage()) {
      console.log(
        `currentPage ${book.currentPage} has no panels. allowSlideNext=true`
      );
      swiper.allowSlideNext = true;
    }
    if (book.hasPrevPage()) swiper.allowSlidePrev = true;
  };

  const handleOnPrevEnd = (swiper: Swiper, book: Book) => {
    book.goToPrev();
    console.log(
      `new current page is ${book.currentPage} and displayImage is ${
        book.getCurrentPage().displayImage
      }`
    );
    console.log("handleOnPrevEnd");
    const currentPage = book.getCurrentPage();
    if (currentPage.hasPrevPanel()) {
      console.log(
        `currentPage ${book.currentPage} has previous panel(s). allowSlidePrev=false`
      );
      swiper.allowSlideNext = false;
    } else if (book.hasPrevPage()) {
      console.log(
        `currentPage ${book.currentPage} has no panels. allowSlideNext=true`
      );
      swiper.allowSlideNext = true;
    }
    if (book.hasNextPage()) swiper.allowSlideNext = true;
  };

  const handleOnNavigationNext = (swiper: Swiper, { book }: { book: Book }) => {
    const currentPage = book.getCurrentPage();
    //we're prevented from moving next so we have a panel to transition to
    //or we're at the end of the slide show
    if (!swiper.allowSlideNext) {
      console.log(
        `going from panel ${
          currentPage.isOnPageImage() ? "pageImage" : currentPage.currentPanel
        } to next panel ${
          currentPage.isOnPageImage() ? 0 : currentPage.currentPanel + 1
        }`
      );
      //advance the panel. need to prop drill the new image source into the canvas ref in
      //order to trigger a render. get ref to the canvas and change the src on the element
      currentPage.nextImage();
      console.log(`displayImage is now ${book.getCurrentPage().displayImage}`);
      //we don't allow slide to previous page as we have a panel
      //on the current page to go back to first
      swiper.allowSlidePrev = false;
    }
    //if we're at the end of a page and theres a another page
    //allow the next slide to trigger
    if (
      !swiper.allowSlideNext &&
      !currentPage.hasNextPanel() &&
      book.hasNextPage()
    ) {
      console.log(`at the end of the page. allowed to go to next`);
      swiper.allowSlideNext = true;
    }
  };

  const handleOnNavigationPrev = (swiper: Swiper, { book }: { book: Book }) => {
    const currentPage = book.getCurrentPage();
    //we're prevented from moving previous we have a panel to transition to
    //or we're at the beginning of the slide show
    // if (!swiper.allowSlidePrev && currentPage.hasPrevPanel()) {
    if (!swiper.allowSlidePrev) {
      console.log(
        `going from panel ${currentPage.currentPanel} to prev panel ${
          currentPage.currentPanel === 0
            ? "pageImage"
            : currentPage.currentPanel - 1
        }`
      );
      currentPage.prevImage();
      console.log(`displayImage is now ${book.getCurrentPage().displayImage}`);
      swiper.allowSlideNext = false;
    }

    if (
      !swiper.allowSlidePrev &&
      book.hasPrevPage() &&
      book.getCurrentPage().isOnPageImage()
    ) {
      console.log(`at the start of the page. allowed to go to previous page`);
      swiper.allowSlidePrev = true;
    }

    // if (
    //   !swiper.allowSlidePrev &&
    //   book.hasPrevPage() &&
    //   book.getCurrentPage().isOnPageImage()
    // ) {
    //   console.log(`at the start of the page. allowd to go to prev`);
    //   swiper.allowSlidePrev = true;
    // }
  };

  /**
   * @todo Enable swipe only when switching pages. Enable swipe to change panels
   * based on direction
   */
  const handleOnSwiperMove = (swiper: Swiper, { book }: { book: Book }) => {
    //sometimes swiper.swipeDirection is undefined so we can determine a dir this way
    // const dir =
    //   swiper.realIndex > swiper.previousIndex ||
    //   swiper.previousIndex === undefined
    //     ? "next"
    //     : "prev";
    // console.log(`handleOnSwiperMove ${dir}`);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Psycho Reader Proof of Concept</title>
        <meta name="description" content="Psycho Reader Proof of Concept" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className={styles.header}></header>
      <main className={styles.main}>
        <div className={styles.swiperContainer}>
          {/* @todo Move 👇 to the PsychoClient file */}
          <SwiperElement
            allowTouchMove={false}
            modules={[Navigation, Pagination]}
            navigation={true}
            pagination={{
              clickable: false,
            }}
            // onBeforeSlideChangeStart={(swiper) => {
            //   console.log(`onBeforeSlideChangeStart`);
            //   handleOnSlideChange(swiper, psychoClient);
            // }}
            onNavigationNext={(swiper) => {
              console.log(`**********onNavigationNext**********`);
              handleOnNavigationNext(swiper, psychoClient);
            }}
            onNavigationPrev={(swiper) => {
              console.log(`**********onNavigationPrev**********`);
              handleOnNavigationPrev(swiper, psychoClient);
            }}
            onSlideChangeTransitionEnd={(swiper) => {
              console.log(`onSlideChangeTransitionEnd`);
              handleOnSlideChangeEnd(swiper, psychoClient);
            }}
            onSliderMove={(swiper) => {
              handleOnSwiperMove(swiper, psychoClient);
            }}
            slidesPerView={1}
          >
            {!!psychoClient.book &&
              psychoClient.book.pages.map((page: Page, pageIndex: number) => {
                console.log(`page.displayImage ${page.displayImage}`);
                let ref = createRef<HTMLCanvasElement>();
                page.ref = ref;
                return (
                  <SwiperSlide
                    key={page.imageUrl}
                    className={styles.psychoSwiper}
                  >
                    <Canvas
                      src={page.displayImage}
                      width={page.pageDimensions.width}
                      height={page.pageDimensions.height}
                      objectPosition="contain"
                      page={page}
                      canvasRef={ref}
                    />
                  </SwiperSlide>
                );
              })}
          </SwiperElement>
        </div>
      </main>
      <footer className={styles.footer}></footer>
    </div>
  );
};

export default Home;
