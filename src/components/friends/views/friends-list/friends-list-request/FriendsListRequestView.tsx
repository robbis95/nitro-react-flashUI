import { FC } from 'react';
import { FriendListTabs, LocalizeText } from '../../../../../api';
import { Base, Column, Flex, NitroCardAccordionSetView, NitroCardAccordionSetViewProps, Text } from '../../../../../common';
import { useFriends } from '../../../../../hooks';
import { FriendsListRequestItemView } from './FriendsListRequestItemView';

interface FriendsListRequestViewProps extends NitroCardAccordionSetViewProps
{
    setShowHoverText?: (text: string) => void;
}

export const FriendsListRequestView: FC<FriendsListRequestViewProps> = props =>
{
    const { setShowHoverText = null, children = null, ...rest } = props;
    const { requests = [], requestResponse = null } = useFriends();

    if(!requests.length) return null;

    return (
        <NitroCardAccordionSetView friendlistTab={ FriendListTabs.REQUESTS } setShowHoverText={ (e) => setShowHoverText(e) } { ...rest }>
            <Column fullHeight justifyContent="between" className="position-relative" overflow="hidden">
                <Column gap={ 0 } overflow="auto">
                    { requests.map((request, index) => <FriendsListRequestItemView key={ index } request={ request } setShowHoverText={ (e) => setShowHoverText(e) } />) }
                </Column>
                <Column className="position-absolute bottom-0 w-100">
                    <Flex gap={ 1 } className="friend-active-tab" justifyContent="center" alignItems="center">
                        <Column fullWidth className="px-1 mb-1" gap={ 0 }>
                            <Flex className="volter-button" gap={ 2 } justifyContent="start" onClick={ () => requestResponse(-1, true) } onMouseEnter={ () => setShowHoverText(LocalizeText('friendlist.requests.acceptall')) } onMouseLeave={ () => setShowHoverText('') }>
                                <Base className="nitro-friends-spritesheet icon icon-accept-check mt-1 ms-2" />
                                <Text className="mt-1">{ LocalizeText('friendlist.requests.acceptall') }</Text>
                            </Flex>
                            <Flex className="volter-button" gap={ 2 } justifyContent="start" onClick={ () => requestResponse(-1, false) } onMouseEnter={ () => setShowHoverText(LocalizeText('friendlist.requests.dismissall')) } onMouseLeave={ () => setShowHoverText('') }>
                                <Base className="nitro-friends-spritesheet icon icon-decline-x mt-1 ms-2" />
                                <Text className="mt-1">{ LocalizeText('friendlist.requests.dismissall') }</Text>
                            </Flex>
                        </Column>
                    </Flex>
                </Column>
            </Column>
            { children }
        </NitroCardAccordionSetView>
    );
}
