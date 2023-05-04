import { CSSProperties, FC, MouseEvent, useCallback, useRef } from 'react';
import { ColumnProps, DraggableWindow, DraggableWindowPosition, DraggableWindowProps } from '../../../common';
import { VolterColours } from '../../common/VolterColours';
import { FrameContext } from './FrameContext';

export interface TonFrameViewProps extends DraggableWindowProps, ColumnProps
{
    skin?: number;
    title?: string;
    colour?: string;
    headerColour?: string;
    closeable?: boolean;
    draggable?: boolean;
    modal?: boolean;

    onCloseClick?: (event: MouseEvent) => void;
}

export const Frame: FC<TonFrameViewProps> = props =>
{
    const { skin = 0, title = '', closeable = true, draggable = true, modal = false, onCloseClick = null, uniqueKey = null, handleSelector = '.drag-handler', windowPosition = DraggableWindowPosition.CENTER, disableDrag = false, overflow = 'hidden', position = 'relative', gap = 0, classNames = [], children = null, offsetLeft = 0, offsetTop = 0, innerRef = null, ...rest } = props;

    const ref = useRef<HTMLDivElement>(null);

    const styles = useCallback(()=>
    {
        let newStyle: CSSProperties = {};


        if(ref && ref.current) 
        {
            newStyle['--frame-width'] = ref.current.clientWidth + 'px';
            newStyle['--frame-height'] = ref.current.clientHeight + 'px';
        }

        return newStyle;
    },[ ref ]);

    const drag = <DraggableWindow uniqueKey={ uniqueKey } handleSelector={ handleSelector } windowPosition={ windowPosition } disableDrag={ !draggable } offsetLeft={ offsetLeft } offsetTop={ offsetTop } dragStyle={ { ...styles() } }>
        <FrameContext { ...props } innerRef={ ref }/>
    </DraggableWindow>

    if(!draggable) return <FrameContext { ...props }/>;
    
    return <DraggableWindow uniqueKey={ uniqueKey } handleSelector={ handleSelector } windowPosition={ windowPosition } disableDrag={ !draggable } offsetLeft={ offsetLeft } offsetTop={ offsetTop } dragStyle={ { ...styles() } } modal={ modal }>
        <FrameContext { ...props } innerRef={ ref }/>
    </DraggableWindow>;
}
