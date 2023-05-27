import { CSSProperties, FC, useMemo } from 'react';
import { Base, BaseProps } from '../Base';

export interface LayoutSearchSavesViewProps extends BaseProps<HTMLDivElement>
{
    title: string;
    onClick?: () => void;
}

export const LayoutSearchSavesView: FC<LayoutSearchSavesViewProps> = props =>
{
    const { title = null, onClick = null, style = {}, } = props;

    const getStyle = useMemo(() =>
    {
        let newStyle: CSSProperties = {};

        if(Object.keys(style).length) newStyle = { ...newStyle, ...style };

        return newStyle;
    }, [ style ]);

    return (
        <Base className="icon icon-search_save" pointer title={ title } onClick={ onClick } style={ getStyle } />
    );
}
