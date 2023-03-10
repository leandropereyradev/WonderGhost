import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants.js";

export const BGROUNDDB = [
  {
    name: "moon",
    xPosition: CANVAS_WIDTH,
    yPosition: 0,
    image: new Image(),
    src: "../../src/img/background/moon.png",
    speed: 0.07,
    xPosition2: 0,
    width: 300,
    infinity: false,
    right: false,
    controled: false,
  },
  {
    name: "lastBG",
    xPosition: 0,
    yPosition: 30,
    image: new Image(),
    src: "../../src/img/background/background3.png",
    speed: 0.1,
    xPosition2: 1865,
    width: 1865,
    infinity: true,
    right: false,
    controled: true,
  },
  {
    name: "lastCloud",
    xPosition: 0,
    yPosition: 60,
    image: new Image(),
    src: "../../src/img/background/clouds.png",
    speed: 0.8,
    xPosition2: 1865,
    width: 1865,
    infinity: true,
    right: false,
    controled: false,
  },
  {
    name: "middleBG",
    xPosition: 0,
    yPosition: 40,
    image: new Image(),
    src: "../../src/img/background/background2.png",
    speed: 0.3,
    xPosition2: 1865,
    width: 1865,
    infinity: true,
    right: false,
    controled: true,
  },
  {
    name: "firstBG",
    xPosition: 0,
    yPosition: 56,
    image: new Image(),
    src: "../../src/img/background/background1.png",
    speed: 0.5,
    xPosition2: 1865,
    width: 1865,
    infinity: true,
    right: false,
    controled: true,
  },

  {
    name: "firstCloud",
    xPosition: 400,
    yPosition: 250,
    image: new Image(),
    src: "../../src/img/background/clouds.png",
    speed: 0.4,
    xPosition2: 1865,
    width: 1865,
    infinity: true,
    right: true,
    controled: false,
  },
  {
    name: "floor",
    xPosition: 0,
    yPosition: CANVAS_HEIGHT - 100,
    image: new Image(),
    src: "../../src/img/background/floor.png",
    speed: 1,
    xPosition2: 1865,
    width: 1865,
    infinity: true,
    right: false,
    controled: true,
  },
];
