This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How it works

1. A Request to the index page generates a server side request to get the config for the Reader.
   1. From the datasrc location in the env file, the location is traversed taking in files to use
      to construct objects representing pages and panels. Each object has an image souce, dimensions,
      and a center point that are calculated.
   2. Once all objects are created, the config is passed back as props to the Home component
2. Once the config is generated, we create a Client that takes in the config and reconstructs the objects
   needed
3. Map over each page object to create SwiperSlides with a custom Canvas component
4. OnNavigationEvents determine page/panel changes.

## Todo

- Prop drilling with the new panel image doesn't seem to work so when we want to move from a page image to a
  panel image, the component does not re-render
- Animate the transition from viewing the page image to viewing the panel image. The idea being the panel image
  animates off of the page and scales to be the main image.
- On click/touch zoom functionality for a given image
- Make responsive and mobile friendly
- Enable swipe navigation
- Move all of the functionality in the index page to the Client class
