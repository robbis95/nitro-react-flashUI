import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, useMemo } from 'react';
import { Flex, FlexProps } from '../../../../common';

interface CaretViewProps extends FlexProps
{
    collapsed?: boolean;
}
export const ContextMenuCaretView: FC<CaretViewProps> = props =>
{
    const { justifyContent = 'center', alignItems = 'center', classNames = [], collapsed = true, ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'menu-bottom' ];

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ classNames ]);

    return <Flex justifyContent={ justifyContent } alignItems={ alignItems } classNames={ getClassNames } { ...rest }>
        <i className={!collapsed ? 'icon icon-context-menu-arrow-down' : 'icon icon-context-menu-arrow-up' } />
    </Flex>
}
