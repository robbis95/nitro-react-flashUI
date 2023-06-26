import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Base, Column, ColumnProps, Flex, Text } from '../..';
import { useNitroCardAccordionContext } from './NitroCardAccordionContext';

export interface NitroCardAccordionSetInnerViewProps extends ColumnProps
{
    headerText: string;
    isExpanded?: boolean;
}

export const NitroCardAccordionSetInnerView: FC<NitroCardAccordionSetInnerViewProps> = props =>
{
    const { headerText = '', isExpanded = false, gap = 0, classNames = [], children = null, ...rest } = props;
    const [ isOpen, setIsOpen ] = useState(false);
    const { setClosers = null, closeAll = null } = useNitroCardAccordionContext();

    const onClick = () =>
    {

        setIsOpen(prevValue => !prevValue);
    }

    const close = useCallback(() => setIsOpen(false), []);

    const getClassNames = useMemo(() =>
    {
        const newClassNames = [ '' ];

        if(isOpen) newClassNames.push('active');

        if(classNames && classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ isOpen, classNames ]);

    useEffect(() =>
    {
        setIsOpen(isExpanded);
    }, [ isExpanded ]);

    useEffect(() =>
    {
        const closeFunction = close;

        setClosers(prevValue =>
        {
            const newClosers = [ ...prevValue ];

            newClosers.push(closeFunction);

            return newClosers;
        });

        return () =>
        {
            setClosers(prevValue =>
            {
                const newClosers = [ ...prevValue ];

                const index = newClosers.indexOf(closeFunction);

                if(index >= 0) newClosers.splice(index, 1);

                return newClosers;
            });
        }
    }, [ close, setClosers ]);

    return (
        <Column classNames={ getClassNames } gap={ gap } { ...rest }>
            <Column fullHeight gap={ 0 }>
                <Flex pointer gap={ 0 } onClick={ onClick }>
                    <Text gfbold variant="black" className=" px-2 py-1">{ headerText }</Text>
                    { isOpen && <Base className="mt-1 icon icon-friendlist_arrow_black_down" /> }
                    { !isOpen && <Base className="mt-1 icon icon-friendlist_arrow_black_right" /> }
                </Flex>
                { isOpen &&
                    <Column fullHeight overflow="hidden" gap={ 0 } className="nitro-card-accordion-set-content cursor-pointer">
                        { children }
                    </Column>
                }
            </Column>
        </Column>
    );
}
