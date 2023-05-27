import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Base, Column, ColumnProps, Flex } from '../..';
import { FriendListTabs, LocalizeText } from '../../../api';
import { useNitroCardAccordionContext } from './NitroCardAccordionContext';

export interface NitroCardAccordionSetViewProps extends ColumnProps
{
    headerText: string;
    isExpanded?: boolean;
    friendlistTab?: FriendListTabs;
    setShowHoverText?: (text: string) => void;
}

export const NitroCardAccordionSetView: FC<NitroCardAccordionSetViewProps> = props =>
{
    const { headerText = '', isExpanded = false, friendlistTab = null, setShowHoverText = null, gap = 0, classNames = [], children = null, ...rest } = props;
    const [ isOpen, setIsOpen ] = useState(false);
    const { setClosers = null, closeAll = null } = useNitroCardAccordionContext();

    const onClick = () =>
    {
        closeAll();

        setIsOpen(prevValue => !prevValue);
    }

    const onClose = useCallback(() => setIsOpen(false), []);

    const getClassNames = useMemo(() =>
    {
        const newClassNames = [ 'nitro-card-accordion-set' ];

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
        const closeFunction = onClose;

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
    }, [ onClose, setClosers ]);

    return (
        <Column classNames={ getClassNames } gap={ gap } { ...rest }>
            <Flex pointer className="nitro-card-accordion-set-header px-2 py-1" onMouseEnter={ () => setShowHoverText(LocalizeText(`${ friendlistTab }`)) } onMouseLeave={ () => setShowHoverText('') } onClick={ onClick }>
                <div className="friend-header-text d-inline">{ headerText }</div>
                { isOpen && <Base className={ `icon icon-friendlist_${ (friendlistTab === FriendListTabs.YOUR_FRIENDS) ? 'arrow_black' : 'arrow_white' }_down` } /> }
                { !isOpen && <Base className={ `icon icon-friendlist_${ (friendlistTab === FriendListTabs.YOUR_FRIENDS) ? 'arrow_black' : 'arrow_white' }_right` } /> }
            </Flex>
            { isOpen &&
                <Column fullHeight overflow="auto" gap={ 0 } className={ `nitro-card-accordion-set-content${ (friendlistTab === FriendListTabs.SEARCH_HABBOS) ? '-gray' : '' } p-1` }>
                    { children }
                </Column> }
        </Column>
    );
}
