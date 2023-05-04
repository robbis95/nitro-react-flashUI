import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { tintImage } from '../../../api/utils/Colourizer';
import { Base, Column, DraggableWindowPosition, Flex } from '../../../common';
import { UseMountEffect } from '../../../hooks';
import { VolterColours } from '../../common/VolterColours';
import { TonFrameViewProps } from './Frame';


const MEMORY = [];
export const FrameContext = (props: TonFrameViewProps) => 
{
    const { skin = 0, title = '', colour = VolterColours.primary_frame_bg, headerColour = VolterColours.primary_frame_header, closeable = true, draggable = true, modal= false, onCloseClick = null, uniqueKey = null, handleSelector = '.drag-handler', windowPosition = DraggableWindowPosition.CENTER, disableDrag = false, overflow = 'hidden', position = 'relative', gap = 0, classNames = [], children = null, offsetLeft = 0, offsetTop = 0, innerRef = null,visible=true, ...rest } = props;
    
    const [ ready,setReady ] = useState<boolean>(false);

    const psuedoRef = useRef<HTMLDivElement>();
    
    const bgRef = useRef<HTMLDivElement>();
    const headerRef = useRef<HTMLDivElement>();
    const textRef = useRef<HTMLDivElement>();
    
    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'ton-frame' ];
    
        if(classNames.length) newClassNames.push(...classNames);

        if(!ready) newClassNames.push('opacity-0');
    
        return newClassNames;
    }, [ classNames,ready ]);
    
    const getImg = useCallback((ref, bg = false) =>
    {
        if (ref && !ref.current) return null;
            
        if (bg) return document.defaultView.getComputedStyle(ref.current).backgroundImage.replace('url("', '').replace('")', '')
    
        return document.defaultView.getComputedStyle(ref.current).borderImageSource.replace('url("','').replace('")','')
            
    },[ ]);
    
    useEffect(()=> 
    {
        if(psuedoRef && psuedoRef.current)
        {
            if(innerRef) innerRef.current = psuedoRef.current;
            bgRef.current = psuedoRef.current;
        }
    }, [ psuedoRef, bgRef,innerRef ]);

    const setup = useCallback(async() => 
    {
        if (bgRef && bgRef.current && getImg(bgRef)) await tintImage(getImg(bgRef), colour).then((res) =>
        {
            bgRef.current.style.borderImageSource = `url(${ res })`;
        }).catch(() => 
        {});
    
        if (headerRef && headerRef.current && getImg(headerRef)) await tintImage(getImg(headerRef), headerColour).then((res) =>
        {
            headerRef.current.style.borderImageSource = `url(${ res })`;
        }).catch(() => 
        {});
    
        if (textRef && textRef.current && getImg(textRef, true)) await tintImage(getImg(textRef, true), colour).then((res) =>
        {
            textRef.current.style.backgroundImage = `url(${ res })`;
        }).catch(() => 
        {});
    
        setTimeout(() => setReady(true),0)
    
    },[ getImg, colour, headerRef,textRef,bgRef ]);
    

    UseMountEffect(() => 
    {
        setup();
    });
        
    return <>
        { skin === 0 && title && <Flex>
            <Flex className="ton-frame-header-bg w-100 drag-handler" data-style={ skin } innerRef={ headerRef }>
                <Base className="ton-frame-header-text" data-style={ skin } innerRef={ textRef }>{ title }</Base>
                { closeable && <Base className="ton-frame-close cursor-pointer" data-style={ skin } onClick={ onCloseClick } /> }
            </Flex>
        </Flex> }
        <Column innerRef={ psuedoRef } overflow={ overflow } position={ position } gap={ gap } classNames={ getClassNames } data-style={ skin } { ...rest }>
            { skin > 0 && title && <Flex>
                <Flex className="ton-frame-header-bg w-100 drag-handler" data-style={ skin } innerRef={ headerRef }>
                    <Base className="ton-frame-header-text" data-style={ skin } innerRef={ textRef }>{ title }</Base>
                    { closeable && <Base className="ton-frame-close cursor-pointer" data-style={ skin } onClick={ onCloseClick } /> }
                </Flex>
            </Flex> }
            { children }
        </Column></>;
}
