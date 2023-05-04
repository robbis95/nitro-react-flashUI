const cache: Map<string, string> = new Map();

const canvasEl: HTMLCanvasElement = document.createElement('canvas');

export async function tintImage(image: string, hex: string, opacity: number = 0, secondary: string = '#000')
{
    let namespace = `${ image }-${ hex }-${ secondary }-${ opacity }`;

    if (cache.get(namespace))
    {
        return cache.get(namespace);
    }

    const img = new Image();
    img.src = image;

    await new Promise((resolve, reject) => 
    {
        img.onload = resolve;
        img.onerror = reject;
    });

    return tint(img, hex, opacity, secondary);
}

function colourPixel(data: Uint8ClampedArray, i: number, rgb: { r,g,b }, opacity: number) 
{
    if (!rgb?.r || !rgb?.g || !rgb?.b) return;

    data[i] = rgb.r - (data[i] < 255 ? (255 - data[i]) : 0);
    data[i + 1] = rgb.g - (data[i + 1] < 255 ? (255 - data[i + 1]) : 0);
    data[i + 2] = rgb.b - (data[i + 2] < 255 ? (255 - data[i + 2]) : 0);
    data[i + 3] = 255 - opacity;
}

export function tint(image: HTMLImageElement, hex: string, opacity: number = 0, secondary: string = '#000')
{
    let namespace = `${ image.src }-${ hex }-${ secondary }-${ opacity }`;

    const ctx = canvasEl.getContext('2d',{ willReadFrequently: true });

    if (cache.get(namespace))
    {
        return cache.get(namespace);
    }
    
    canvasEl.width = image.width;
    canvasEl.height = image.height;

    ctx.drawImage(image, 0, 0);

    const data = ctx.getImageData(0, 0, canvasEl.width, canvasEl.height,{});

    let rgb = hexToRgb(hex);
    const rgb2 = hexToRgb(secondary);

    if(!rgb) return canvasEl.toDataURL();

    for(let i = 0; i < data.data.length; i += 4) 
    {
        if(data.data[i] + data.data[i + 1] + data.data[i + 2] + data.data[i + 2] !== 0) 
        {

            if(secondary !== '#000' && data.data[i] <= (255 * 2) / 3) 
            {
                data.data[i] = (data.data[i] + 127)
                data.data[i + 1] = (data.data[i + 1] + 127)
                data.data[i + 2] = (data.data[i + 2] + 127) 

                colourPixel(data.data,i,rgb2,opacity);
            }
            else colourPixel(data.data,i,rgb,opacity);

        }
        else 
        {
            if(data.data[i + 3] != 0 && opacity) data.data[i + 3] = 255 - opacity;
        }
    }

    ctx.putImageData(data, 0, 0);

    cache.set(namespace, canvasEl.toDataURL())

    return cache.get(namespace);
}

function hexToRgb(hex) 
{
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function componentToHex(c) 
{
    var hex = c.toString(16);
    return hex.length == 1 ? '0' + hex : hex;
}

export function rgbToHex(r, g, b) 
{
    return '#' + componentToHex(parseInt(r)) + componentToHex(parseInt(g)) + componentToHex(parseInt(b));
}

export function getStyleOf(selector: string, property: string) 
{
    let result = '';

    for (const sheet of Array.from(document.styleSheets)) 
    {
        for (const rule of Array.from(sheet.cssRules || sheet.rules)) 
        {
            if (rule instanceof CSSStyleRule && rule.selectorText == selector) 
            {
                result = rule.style[property];
            }
        }
    }

    return result;
}
