import { HabboSearchComposer, HabboSearchResultData, HabboSearchResultEvent } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { FriendListTabs, GetUserProfile, LocalizeText, OpenMessengerChat, SendMessageComposer } from '../../../../api';
import { Base, Column, Flex, NitroCardAccordionItemView, NitroCardAccordionSetView, NitroCardAccordionSetViewProps, Text, UserProfileIconView } from '../../../../common';
import { useFriends, useMessageEvent } from '../../../../hooks';

interface FriendsSearchViewProps extends NitroCardAccordionSetViewProps
{
    isFromSearchToolbar?: boolean;
    setShowHoverText?: (text: string) => void;
}

export const FriendsSearchView: FC<FriendsSearchViewProps> = props =>
{
    const { isFromSearchToolbar = false, setShowHoverText = null, ...rest } = props;
    const [ searchValue, setSearchValue ] = useState('');
    const [ friendResults, setFriendResults ] = useState<HabboSearchResultData[]>(null);
    const [ otherResults, setOtherResults ] = useState<HabboSearchResultData[]>(null);
    const { canRequestFriend = null, requestFriend = null } = useFriends();

    useMessageEvent<HabboSearchResultEvent>(HabboSearchResultEvent, event =>
    {
        const parser = event.getParser();

        setFriendResults(parser.friends);
        setOtherResults(parser.others);
    });

    useEffect(() =>
    {
        if(!searchValue || !searchValue.length) return;

        const timeout = setTimeout(() =>
        {
            if(!searchValue || !searchValue.length) return;

            SendMessageComposer(new HabboSearchComposer(searchValue));
        }, 500);

        return () => clearTimeout(timeout);
    }, [ searchValue ]);

    return (
        <NitroCardAccordionSetView friendlistTab={ FriendListTabs.SEARCH_HABBOS } isExpanded={ isFromSearchToolbar ? true : false } setShowHoverText={ (e) => setShowHoverText(e) } { ...rest }>
            <Column className="w-100 h-100 position-relative">
                <Column gap={ 0 }>
                    { friendResults &&
                    <>
                        { (friendResults.length === 0) &&
                            <Text gfbold variant="black" className=" px-2 py-1">{ LocalizeText('friendlist.search.nofriendsfound') }</Text> }
                        { (friendResults.length > 0) &&
                            <Column gap={ 0 }>
                                <Text gfbold variant="black" className=" px-2 py-1">{ LocalizeText('friendlist.search.friendscaption', [ 'cnt' ], [ friendResults.length.toString() ]) }</Text>
                                <Column gap={ 0 }>
                                    { friendResults.map(result =>
                                    {
                                        return (
                                            <NitroCardAccordionItemView key={ result.avatarId } justifyContent="between" className="friend-tab-search px-2 py-1 cursor-pointer" onClick={ () => GetUserProfile(result.avatarId) }>
                                                <Flex alignItems="center" gap={ 1 } style={ { marginLeft: '10px' } }>
                                                    <UserProfileIconView userId={ result.avatarId } />
                                                    <Text variant="black">{ result.avatarName }</Text>
                                                </Flex>
                                                <Flex alignItems="center" gap={ 1 }>
                                                    <Base className="nitro-friends-spritesheet icon icon-friend_message" onClick={ event => OpenMessengerChat(result.avatarId) } onMouseEnter={ () => setShowHoverText(LocalizeText('friendlist.tip.im')) } onMouseLeave={ () => setShowHoverText('') } />
                                                </Flex>
                                            </NitroCardAccordionItemView>
                                        )
                                    }) }
                                </Column>
                            </Column> }
                    </> }
                    { otherResults &&
                    <>
                        { (otherResults.length === 0) &&
                            <Text gfbold variant="black" className="px-2 py-1">{ LocalizeText('friendlist.search.noothersfound') }</Text> }
                        { (otherResults.length > 0) &&
                            <Column gap={ 0 }>
                                <Text gfbold variant="black" className="px-2 py-1">{ LocalizeText('friendlist.search.otherscaption', [ 'cnt' ], [ otherResults.length.toString() ]) }</Text>
                                <Column gap={ 0 }>
                                    { otherResults.map(result =>
                                    {
                                        return (
                                            <NitroCardAccordionItemView key={ result.avatarId } justifyContent="between" className="friend-tab-search px-2 py-1 cursor-pointer" onClick={ () => GetUserProfile(result.avatarId) }>
                                                <Flex alignItems="center" gap={ 1 } style={ { marginLeft: '10px' } }>
                                                    <UserProfileIconView userId={ result.avatarId } />
                                                    <Text variant="black">{ result.avatarName }</Text>
                                                </Flex>
                                                <Flex alignItems="center" gap={ 1 }>
                                                    { canRequestFriend(result.avatarId) &&
                                                    <Base className="nitro-friends-spritesheet icon-add cursor-pointer" onClick={ event => requestFriend(result.avatarId, result.avatarName) } onMouseEnter={ () => setShowHoverText(LocalizeText('friendlist.tip.addfriend')) } onMouseLeave={ () => setShowHoverText('') } /> }
                                                </Flex>
                                            </NitroCardAccordionItemView>
                                        )
                                    }) }
                                </Column>
                            </Column> }
                    </> }
                </Column>
                <Column className="position-absolute bottom-0 w-100">
                    <Flex gap={ 1 } className="friend-active_search-tab p-1" justifyContent="center" alignItems="center">
                        <Flex className="w-100">
                            <input type="text" className="w-100 friend-search" value={ searchValue } maxLength={ 50 } onChange={ event => setSearchValue(event.target.value) } onMouseEnter={ () => setShowHoverText(LocalizeText('friendlist.tip.searchstr')) } onMouseLeave={ () => setShowHoverText('') } />
                        </Flex>
                        <Flex className="">
                            <Base className="search-friend-icon" onClick={ () => setSearchValue(searchValue) } onMouseEnter={ () => setShowHoverText(LocalizeText('friendlist.tip.search')) } onMouseLeave={ () => setShowHoverText('') }>
                                <Text center variant="black" className="mt-1 ms-2 px-3">{ LocalizeText('generic.search') }</Text>
                            </Base>
                        </Flex>
                    </Flex>
                </Column>
            </Column>
        </NitroCardAccordionSetView>
    );
}
