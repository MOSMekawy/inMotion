export { createCanvas, fetchImg };

const createCanvas = (): HTMLCanvasElement => {

    let root = document.getElementsByTagName('body')[0];
    let canvas = document.createElement('canvas');

    root.appendChild(canvas);

    return canvas;

};

function fetchImgClosure() {

    const imgs: { 
        [key: string]: any 
    } = {};

    return (path: string) : Promise<HTMLImageElement> => { 

        return new Promise((resolve, reject) => {

            if (imgs[path]) {

              resolve(imgs[path]);

            } else {

              imgs[path] = new Image();
              imgs[path].src = path;
    
            }

            imgs[path].complete && resolve(imgs[path]);
    
            let success = () => {
                imgs[path].removeEventListener('load', success, false);
                resolve(imgs[path]);
            }
    
            let fail = () => {
                imgs[path].removeEventListener('error', fail, false);
                reject();
            };
    
            imgs[path].addEventListener('load', success, false);
    
            imgs[path].addEventListener('error', fail, false);
    
    
        });

    }

};

const fetchImg = fetchImgClosure();