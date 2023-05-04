const cache = new Map<string, string>();
const canvasEl = document.createElement('canvas');

export async function tintImage(imageSrc: string, hex: string, opacity = 0, secondary = '#000') 
{
    const cacheKey = `${ imageSrc }-${ hex }-${ secondary }-${ opacity }`;

    if (cache.has(cacheKey)) 
    {
        return cache.get(cacheKey);
    }

    const img = new Image();
    img.src = imageSrc;

    await new Promise((resolve, reject) => 
    {
        img.onload = resolve;
        img.onerror = reject;
    });

    return tint(img, hex, opacity, secondary);
}

function colorPixel(data: Uint8ClampedArray, index: number, rgb: { r, g, b }, opacity: number) 
{
    if (!rgb?.r || !rgb?.g || !rgb?.b) return;

    data[index] = rgb.r - (data[index] < 255 ? (255 - data[index]) : 0);
    data[index + 1] = rgb.g - (data[index + 1] < 255 ? (255 - data[index + 1]) : 0);
    data[index + 2] = rgb.b - (data[index + 2] < 255 ? (255 - data[index + 2]) : 0);
    data[index + 3] = 255 - opacity;
}

export function tint(image: HTMLImageElement, hex: string, opacity = 0, secondary = '#000') 
{
    const cacheKey = `${ image.src }-${ hex }-${ secondary }-${ opacity }`;

    const ctx = canvasEl.getContext('2d', { willReadFrequently: true });

    if (cache.has(cacheKey)) 
    {
        return cache.get(cacheKey);
    }

    canvasEl.width = image.width;
    canvasEl.height = image.height;

    ctx.drawImage(image, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvasEl.width, canvasEl.height, {});

    const mainRgb = hexToRgb(hex);
    const secondaryRgb = hexToRgb(secondary);

    if (!mainRgb) return canvasEl.toDataURL();

    for (let i = 0; i < imageData.data.length; i += 4) 
    {
        if (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2] !== 0) 
        {
            if (secondary !== '#000' && imageData.data[i] <= (255 * 2) / 3) 
            {
                imageData.data[i] += 127;
                imageData.data[i + 1] += 127;
                imageData.data[i + 2] += 127;

                colorPixel(imageData.data, i, secondaryRgb, opacity);
            }
            else 
            {
                colorPixel(imageData.data, i, mainRgb, opacity);
            }
        }
        else 
        {
            if (imageData.data[i + 3] !== 0 && opacity) imageData.data[i + 3] = 255 - opacity;
        }
    }

    ctx.putImageData(imageData, 0, 0);

    cache.set(cacheKey, canvasEl.toDataURL());

    return cache.get(cacheKey);
}

function hexToRgb(hex: string) 
{
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
  
function componentToHex(c: number) 
{
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
}
  
export function rgbToHex(r: number, g: number, b: number) 
{
    return '#' + componentToHex(parseInt(String(r))) + componentToHex(parseInt(String(g))) + componentToHex(parseInt(String(b)));
}
  
export function getStyleOf(selector: string, property: string) 
{
    let result = '';
  
    for (const sheet of Array.from(document.styleSheets)) 
    {
        for (const rule of Array.from(sheet.cssRules || sheet.rules)) 
        {
            if (rule instanceof CSSStyleRule && rule.selectorText === selector) 
            {
                result = rule.style[property];
            }
        }
    }
  
    return result;
}
  