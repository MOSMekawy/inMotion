import engine from "./engine";
import {linear, animate, timeline} from "./easing";
import {createCanvas} from "./helper";

window.onload = function () {
    let canvas: HTMLCanvasElement = createCanvas();
    let context = canvas.getContext("2d");

    let testShape = {
        imgPath: "./sprite.png",
        sliceX: 1514,
        sliceY: 0,
        sliceW: 85,
        sliceH: 90,
        x: 0,
        y: 0,
        width: 90,
        height: 90,
        collides: false,
        animation: {
            test: timeline({
               autoPlay: true,
               loop: true,
               numOfLoops: 4,
               reverse: false
            }).add({
                    target: 'x',    
                    startVal: 0,
                    endVal: 100,
                    duration: 1000,
                    delay: 0,
                    reverse: false,
                    onStart: () => {
                        console.log("HORIZONTAL START");
                    },
                    easing: linear
            }).add({
                target: 'y',    
                startVal: 0,
                endVal: 100,
                duration: 1000,
                delay: 0,
                reverse: false,
                onStart: () => {
                    console.log("VERTICAL START");
                },
                easing: linear
        })
        }
    };

    context && engine({
        context,
        options: {
            width: 300,
            height: 150
        },
        bodies: {
            testShape
        }
    });
};
