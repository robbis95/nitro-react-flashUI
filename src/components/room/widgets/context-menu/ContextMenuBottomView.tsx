import { FC, useMemo } from 'react';
import { Flex, FlexProps } from '../../../../common';

export const ContextMenuBottomView: FC<FlexProps> = props =>
{
    const { justifyContent = 'center', alignItems = 'center', classNames = [], ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'menu-bottom' ];

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ classNames ]);

    return <Flex justifyContent={ justifyContent } alignItems={ alignItems } classNames={ getClassNames } { ...rest } />;
}
