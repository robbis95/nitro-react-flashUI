import { FC, useMemo } from 'react';
import { BaseProps } from '..';
import { VolterColours } from '../../custom/common/VolterColours';
import { Border } from '../../custom/components/layout/Border';

interface LayoutTonItemCountViewProps extends BaseProps<HTMLDivElement>
{
    count: any;
    skin?: number;
    unset?: boolean;
}

export const LayoutTonItemCountView: FC<LayoutTonItemCountViewProps> = props =>
{
    const { count = 0, position = 'absolute', classNames = [], children = null, skin = 6, unset = false, ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'ton-item-count','text-white' ];

        if (classNames.length) newClassNames.push(...classNames);
        
        if(!unset) newClassNames.push('top-0')

        return newClassNames;
    }, [ classNames ]);

    return (
        <Border skin={ skin } colour={ VolterColours.primary_red } position="absolute" classNames={ getClassNames } { ...rest }>
            { count }
            { children }
        </Border>
    );
}
