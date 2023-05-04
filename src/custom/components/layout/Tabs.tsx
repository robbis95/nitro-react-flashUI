import { FC, MutableRefObject, useEffect, useMemo, useRef } from 'react';
import { getStyleOf, tintImage } from '../../../api/utils/Colourizer';
import { ColumnProps, DraggableWindowProps, Flex } from '../../../common';
import { LayoutTonItemCountView } from '../../../common/layout/LayoutTonItemCountView';

export interface TabsProps extends DraggableWindowProps, ColumnProps
{
    skin?: number;
    colour?: string;
    opacity?: number;
    isActive?: boolean;
    count?: number;
}

export const Tabs: FC<TabsProps> = props =>
{
    const { isActive = false, count = 0, skin = 0, gap = 1, overflow = 'hidden', pointer = true, position = 'relative', classNames = [], children = null,innerRef = null, colour = '#FFFFFF', opacity = 0, ...rest } = props;

    const psuedoRef = useRef<HTMLDivElement>();

    const bgRef = useRef<HTMLDivElement>();

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'ton-tab', 'container-fluid', 'justify-content-center' ];

        if(isActive) newClassNames.push('active');

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ isActive, classNames ]);
    

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
        if(!colour || colour === '#FFFFFF') return;

        const getImg = (ref: MutableRefObject<HTMLDivElement>) =>
        {
            if (ref && !ref.current) return null;
    
            return getStyleOf('.ton-tab[data-style="'+skin+'"]','border-image-source').replace('url("','').replace('")','')
            
        };

        if (bgRef && bgRef.current) tintImage(getImg(bgRef), colour, opacity).then((res) =>
        {   
            bgRef.current.style.borderImageSource = `url(${ res })`;
        });
        
    }, [ bgRef, colour, opacity,skin ]);


    return (
        <Flex overflow={ overflow } pointer={ pointer } position={ position } data-style={ skin } classNames={ getClassNames } innerRef={ psuedoRef } { ...rest }>
            <Flex shrink center className="tab-text">
                { children }
            </Flex>
            { (count > 0) &&
            <LayoutTonItemCountView count={ count } /> }
        </Flex>
    );
}
