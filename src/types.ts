export { canvasOpt, body, animControls, animOptions, subAnimOptions };

type canvasOpt = {
    width: number,
    height: number
};

type animControlsObj = {
  [key: string]: animControls 
};

type animControls = {
    apply: Function, 
    play: Function,
    pause: Function,
    restart: Function,
    getDuration: Function,
    getOffset: Function,
};

type body = {
    imgPath: string,
    sliceX: number,
    sliceY: number,
    sliceW: number,
    sliceH: number,
    x: number,
    y: number,
    width: number,
    height: number,
    collides: boolean,
    animation?: animControlsObj, 
    [key: string]: string | number | boolean | animControlsObj | Function | undefined
};

type animOptions = {
    target: string,
    startVal: number,
    endVal: number,
    duration: number,
    steps?: number,
    delay?: number,
    offset?: number,
    numOfLoops: number,
    loop: boolean,
    reverse: boolean,
    autoPlay: boolean,
    onStart?: Function,
    onUpdate?: Function,
    onComplete?: Function,
    easing: Function
};

type subAnimOptions = {
    target: string,
    startVal: number,
    endVal: number,
    duration: number,
    steps?: number,
    delay?: number,
    offset?: number,
    reverse: boolean,
    onStart?: Function,
    onUpdate?: Function,
    onComplete?: Function,
    easing: Function
}