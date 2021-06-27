export {
    linear,
    discrete,
    animate,
    timeline
};

import {animControls, animOptions, body, subAnimOptions} from "./types";

function animate({
    target,
    startVal,
    endVal,
    duration,
    steps,
    delay,
    offset,
    numOfLoops,
    loop,
    reverse,
    autoPlay,
    easing,
    onStart,
    onUpdate,
    onComplete
} : animOptions): animControls {

    let startTime: number;
    let elapsedTime = 0;

    // flag to denote if animation has started or not
    let started = false;

    let solution = startVal;

    let pause = !autoPlay;

    let restart = false;

    let loopCount = 0;

    if (duration <= 0) 
        throw new Error("Duration must be larger than 0");
    
    if (delay && delay < 0) 
        throw new Error("Delay can't be negative");
    

    return {
        apply: function (time: number, body: body): number {

            delay = delay || 0;
            offset = offset || 0;
            startTime = startTime || time;

            // save elapsed prop to keep track of progress
            elapsedTime = time - startTime - delay - offset;

            if (restart) {
 
                body[target] = startVal;

                restart = false;

            }

            if (elapsedTime < 0) 
                return solution;
            
            // if paused then remain at current value.

            if (pause) 
                return solution;
            


            if (loop) {

                // if looping in enabled then execute animation numOfLoops.
                // if numOfloops is 0 then loop infinitely.

                if (numOfLoops && loopCount >= numOfLoops && numOfLoops != 0) { // invoke on complete callback function

                    return solution;
                }

            } else { // if looping is disabled then execute animation once.

                if (loopCount == 1) 
                    return solution;
                

            }

            if (! started) {
                onStart && onStart();

                started = true;
            }

            if (elapsedTime >= duration) {
                startTime = new Date().getTime();

                loopCount += 1;

                started = false;

                onComplete && onComplete();
            }

            // solve equation for variable elapsedTime

            solution = easing({
                startVal,
                endVal,
                duration,
                steps,
                elapsedTime: reverse ? duration - elapsedTime : elapsedTime
            });

            body[target] = solution;

            // invoke on update callback function
            onUpdate && onUpdate();

            return solution;

        },
        play: function () { // calculate new start time while keeping progress

            startTime = new Date().getTime() - elapsedTime;

            loopCount = 0;

            pause = false;

        },
        pause: function () {
            pause = true;
        },
        restart: function () {
            startTime = new Date().getTime();

            restart = true;

            solution = startVal;

            loopCount = 0;

            elapsedTime = 0;

            pause = false;
        },
        getDuration: function () {
            return duration + (delay || 0);
        },
        getOffset: function () {
            return offset;
        }
    };
}

function linear({startVal, endVal, duration, elapsedTime} : {
    startVal : number;
    endVal : number;
    duration : number;
    elapsedTime : number;
}) {
    return elapsedTime < duration ? ((endVal - startVal) / duration) * elapsedTime + startVal : endVal;
}

function discrete({
    startVal,
    endVal,
    steps,
    duration,
    elapsedTime
} : {
    startVal : number;
    endVal : number;
    steps : number;
    duration : number;
    elapsedTime : number;
}) {
    return elapsedTime < duration ? ((endVal - startVal) / steps) * Math.floor((elapsedTime * (steps + 1)) / duration) + startVal : endVal;
}

function timeline({loop, autoPlay, numOfLoops, reverse} : {
    loop : boolean,
    autoPlay : boolean,
    numOfLoops : number
    reverse: boolean
}) {

    let cumulative = 0;
    let sequence: any = [];
    let startTime: number;
    let elapsed = 0;
    let paused = !autoPlay;
    let loopCount = 0;
    let restart = false;

    return {
        add: function (opts: subAnimOptions) {

            const setup = {
                autoPlay,
                loop: false,
                numOfLoops: 0,
                reverse
            }

            let optsCopy = {
                ... opts,
                ... setup
            };

            let {duration, delay, offset} = opts;

            delay = delay || 0;
            offset = offset || 0;

            optsCopy['delay'] = optsCopy['delay'] || 0;
            optsCopy['delay'] += cumulative;

            sequence.push({
                config: opts,
                animation: animate(optsCopy)
            });

            cumulative += duration + delay - offset;

            return this;

        },
        apply: function (time: number, body: body) {

            startTime  = startTime || time;

            if ( paused ) return;
            if ( !loop && elapsed > cumulative ) return;
            if ( loop && loopCount === numOfLoops ) return;

            if (elapsed > cumulative) {

                startTime = time;

                if (numOfLoops !== 0) loopCount++;

                restart = true;

            }

            elapsed = time - startTime;

            sequence.forEach((el : any) => {

                restart && el.animation.restart();

                el.animation.apply(time, body);

            });

            restart = false;

        },
        play: function () {

            startTime = new Date().getTime() - elapsed;
            
            loopCount = 0;

            paused = false;
             
        },
        pause: function () {

            paused = true;

        },
        restart: function () {

            startTime = new Date().getTime();

            elapsed = 0;

            loopCount = 0;

            paused = false;

            restart = true;

        }
    };
}
