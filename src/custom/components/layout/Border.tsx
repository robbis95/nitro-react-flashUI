import { FC, MutableRefObject, useEffect, useMemo, useRef, useState } from 'react';
import { getStyleOf, tintImage } from '../../../api/utils/Colourizer';
import { Flex, FlexProps } from '../../../common';

export interface TonBorderProps extends FlexProps
{
    skin?: number;
    colour?: string;
    isActive?: boolean;
    opacity?: number;
}

export const Border: FC<TonBorderProps> = props =>
{
    let { skin = 0, colour = '#FFFFFF', opacity = 0, innerRef, classNames = [], column = true, ...rest } = props;

    const psuedoRef = useRef<HTMLDivElement>();

    const bgRef = useRef<HTMLDivElement>();

    const [ ready,setReady ] = useState<boolean>(false);

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'ton-border' ];

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ classNames ]);

    useEffect(()=> 
    {
        if(psuedoRef && psuedoRef.current)
        {
            if(innerRef) innerRef.current = psuedoRef.current;
            bgRef.current = psuedoRef.current;
        }
    }, [ psuedoRef, bgRef,innerRef ]);

    useEffect(() =>
    {
        const getImg = (ref: MutableRefObject<HTMLDivElement>) =>
        {
            if (ref && !ref.current) return null;
    
            return getStyleOf('.ton-border[data-style="'+skin+'"]','border-image-source').replace('url("','').replace('")','')
            
        };

        if (bgRef && bgRef.current) tintImage(getImg(bgRef), colour, opacity).then((res) =>
        {   
            bgRef.current.style.borderImageSource = `url(${ res })`;
            setReady(true);
        });
        
    }, [ bgRef, colour, opacity,skin ]);

    return (
        <Flex innerRef={ psuedoRef } data-style={ skin } classNames={ getClassNames } visible={ !ready ? false : true } column={ column } { ...rest }/>
    );
}
