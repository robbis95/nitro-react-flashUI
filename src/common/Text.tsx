import { FC, useMemo } from 'react';
import { Base, BaseProps } from './Base';
import { ColorVariantType, FontSizeType, FontWeightType, TextAlignType } from './types';

export interface TextProps extends BaseProps<HTMLDivElement>
{
    variant?: ColorVariantType;
    fontWeight?: FontWeightType;
    fontSize?: FontSizeType;
    align?: TextAlignType;
    bold?: boolean;
    gfbold?: boolean;
    underline?: boolean;
    italics?: boolean;
    truncate?: boolean;
    center?: boolean;
    textEnd?: boolean;
    small?: boolean;
    wrap?: boolean;
    noWrap?: boolean;
    textBreak?: boolean;
}

export const Text: FC<TextProps> = props =>
{
    const { variant = null, fontWeight = null, fontSize = 0, align = null, bold = false, gfbold = false, underline = false, italics = false, truncate = false, center = false, textEnd = false, small = false, wrap = false, noWrap = false, textBreak = false, ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ '' ];

        if(variant) newClassNames.push('text-' + variant);

        if(bold) newClassNames.push('font-bold');

        if(gfbold) newClassNames.push('goldfish-bold');

        if(fontWeight) newClassNames.push('fw-' + fontWeight);

        if(fontSize) newClassNames.push('fs-' + fontSize);

        if(align) newClassNames.push('text-' + align);

        if(underline) newClassNames.push('text-decoration-underline');

        if(italics) newClassNames.push('font-italic');

        if(truncate) newClassNames.push('text-truncate');

        if(center) newClassNames.push('text-center');

        if(textEnd) newClassNames.push('text-end');

        if(small) newClassNames.push('small');

        if(wrap) newClassNames.push('text-wrap');

        if(noWrap) newClassNames.push('text-nowrap');

        if(textBreak) newClassNames.push('text-break');

        return newClassNames;
    }, [ variant, fontWeight, fontSize, align, bold, gfbold, underline, italics, truncate, center, textEnd, small, wrap, noWrap, textBreak ]);

    return <Base classNames={ getClassNames } { ...rest } />;
}
