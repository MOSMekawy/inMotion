export { createCanvas, fetchImg };

let createCanvas = (): HTMLCanvasElement => {

    let root = document.getElementsByTagName('body')[0];
    let canvas = document.createElement('canvas');

    root.appendChild(canvas);

    return canvas;

};

let fetchImg = async (path: string): Promise<any> => {

    let img : any;

    return new Promise((resolve, reject) => {

        img = new Image();
        img.src = path;

        img.complete && resolve(img);

        let success = () => {
            img.removeEventListener('load', success, false);
            resolve(img);
        }

        let fail = () => {
            img.removeEventListener('error', fail, false);
            reject();
        };

        img.addEventListener('load', success, false);

        img.addEventListener('error', fail, false);


    });

};

