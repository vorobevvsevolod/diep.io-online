var socket = io();
const pjs = new PointJS(400,400, {backgroundColor: "#666666"});
const game = pjs.game;
const key = pjs.keyControl; key.initControl(); 
const mouse = pjs.mouseControl; mouse.initControl();
pjs.system.initFullPage();

const WH = game.getWH();
const point = pjs.vector.point;
let scaleCamera = 1.4;

pjs.system.initFPSCheck();
let tokenAutorization = window.location.href.split("/").pop();

