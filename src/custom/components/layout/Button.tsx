import { FC, MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getStyleOf, tintImage } from '../../../api/utils/Colourizer';
import { Base, BaseProps } from '../../../common';

export interface BorderProps extends BaseProps<HTMLDivElement>
{
    skin?: number;
    colour?: string;
    isActive?: boolean;
    opacity?: number;
    disabled?: boolean;
}

export const Button: FC<BorderProps> = props =>
{
    let { skin = 0, colour = '#FFFFFF', opacity = 0, innerRef, disabled = false, classNames = [], ...rest } = props;

    const psuedoRef = useRef<HTMLDivElement>();

    const bgRef = useRef<HTMLDivElement>();

    const [ ready,setReady ] = useState<boolean>(false);

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'ton-button','cursor-pointer' ];

        if(classNames.length) newClassNames.push(...classNames);

        if(disabled) newClassNames.push('disabled');

        return newClassNames;
    }, [ classNames, disabled ]);

    const getImg = useCallback((ref: MutableRefObject<HTMLDivElement>, hover: boolean = false, active: boolean = false) =>
    {
        if (ref && !ref.current) return null;
        
        return getStyleOf('.ton-button[data-style="'+skin+'"]' + (hover ? ':hover' : '') + (active ? ':active' : ''),'border-image-source').replace('url("','').replace('")','')
        
    },[ skin ]);

    const changeBg = useCallback((hover: boolean = false, active: boolean = false)=>
    {
        if (bgRef && bgRef.current) tintImage(getImg(bgRef, hover,active), colour, opacity).then((res) =>
        {   
            bgRef.current.style.borderImageSource = `url(${ res })`;
            setReady(true);
        }).catch(()=>
        {
            console.log('missing image plz report')
        });
    },[ bgRef, colour, opacity, setReady, getImg ])

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
        if (bgRef && bgRef.current) changeBg();
        
    }, [ changeBg ]);

    return (
        <Base innerRef={ psuedoRef } data-style={ skin } classNames={ getClassNames } visible={ !ready ? false : true } onMouseOver={ () => changeBg(true) } onMouseOut={ () => changeBg() } onMouseDown={ ()=>changeBg(false, true) } onMouseUp={ ()=>changeBg() } { ...rest }/>
    );
}
