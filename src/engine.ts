import { fetchImg } from './helper';
import { canvasOpt, body } from './types';

export default function engine({ context, options, bodies }: { 
    context: CanvasRenderingContext2D, 
    options: canvasOpt, 
    bodies: { 
        [key: string]: body 
    }
}) {

    let update = (body: body) => {

        for (let key in body.animation) {

            body.animation[key]?.apply(new Date().getTime(), body); 

        }

    }

    let draw = async (context: CanvasRenderingContext2D, body: body) => {

        context.drawImage(
            await fetchImg(body.imgPath),
            body.sliceX,
            body.sliceY,
            body.sliceW,
            body.sliceH,
            body.x,
            body.y,
            body.width,
            body.height
        );

    }

    let exec = (context: CanvasRenderingContext2D, options: canvasOpt, bodies:  { 
        [key: string]: body 
    }): any => {

        // clearing canvas
        context.clearRect(0, 0, options.width, options.height);

        for (let key in bodies) {

            // update 
            update(bodies[key]);

            // draw new frame
            draw(context, bodies[key]);

        }

        // loop in sync with refresh rate
        window.requestAnimationFrame(() => exec(context, options, bodies));

    }

    exec(context, options, bodies);

    return {
        deleteBody: (key: string) => {
            delete bodies[key];
        },
        addBody: (key: string, data: body) => {
            bodies[key] = data;
        }
    };

}