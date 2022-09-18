import { InferGetStaticPropsType } from "next";
import { Swiper, SwiperSlide } from "swiper/react";
import Head from "next/head";
import Page from "../components/Page";
import PsychoReader, { PsychoReaderType } from "../components/PsychoReader";
import styles from "../styles/Home.module.css";
import "swiper/css";
import Canvas from "../components/Canvas";

export async function getStaticProps() {
  const reader: PsychoReaderType = await PsychoReader();
  return {
    props: {
      psychoReader: JSON.parse(JSON.stringify(reader)),
    },
  };
}

const Home = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { psychoReader } = props;
  return (
    <div className={styles.container}>
      <Head>
        <title>Psycho Reader Proof of Concept</title>
        <meta name="description" content="Psycho Reader Proof of Concept" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Swiper
          slidesPerView={1}
          onSlideChange={() => console.log("slide change")}
          onSwiper={(swiper) => console.log("onSwiper", swiper)}
        >
          {!!psychoReader.book &&
            psychoReader.book.pages.map((page: Page) => (
              <SwiperSlide key={page.imageUrl}>
                <Canvas src={page.imageUrl} width={400} height={400} />
              </SwiperSlide>
            ))}
        </Swiper>
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
};

export default Home;
