import { ILinkEventTracker, RemoveFriendComposer, SendRoomInviteComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { AddEventLinkTracker, FriendListTabs, LocalizeText, MessengerFriend, RemoveLinkEventTracker, SendMessageComposer } from '../../../../api';
import { Column, Flex, NitroCardAccordionSetView, NitroCardAccordionView, NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../common';
import { NitroCardAccordionSetInnerView } from '../../../../common/card/accordion/NitroCardAccordionSetInnerView';
import { useFriends } from '../../../../hooks';
import { FriendsRemoveConfirmationView } from './FriendsListRemoveConfirmationView';
import { FriendsRoomInviteView } from './FriendsListRoomInviteView';
import { FriendsSearchView } from './FriendsListSearchView';
import { FriendsListGroupView } from './friends-list-group/FriendsListGroupView';
import { FriendsListRequestView } from './friends-list-request/FriendsListRequestView';

export const FriendsListView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const [ selectedFriendsIds, setSelectedFriendsIds ] = useState<number[]>([]);
    const [ showRoomInvite, setShowRoomInvite ] = useState<boolean>(false);
    const [ showRemoveFriendsConfirmation, setShowRemoveFriendsConfirmation ] = useState<boolean>(false);
    const [ showHoverText, setShowHoverText ] = useState<string>(null);
    const [ isFromSearchToolbar, setIsFromSearchToolbar ] = useState<boolean>(false);
    const { onlineFriends = [], offlineFriends = [], requests = [], requestFriend = null } = useFriends();

    const removeFriendsText = useMemo(() =>
    {
        if(!selectedFriendsIds || !selectedFriendsIds.length) return '';

        const userNames: string[] = [];

        for(const userId of selectedFriendsIds)
        {
            let existingFriend: MessengerFriend = onlineFriends.find(f => f.id === userId);

            if(!existingFriend) existingFriend = offlineFriends.find(f => f.id === userId);

            if(!existingFriend) continue;

            userNames.push(existingFriend.name);
        }

        return LocalizeText('friendlist.removefriendconfirm.userlist', [ 'user_names' ], [ userNames.join(', ') ]);
    }, [ offlineFriends, onlineFriends, selectedFriendsIds ]);

    const selectFriend = useCallback((userId: number) =>
    {
        if(userId < 0) return;

        setSelectedFriendsIds(prevValue =>
        {
            const newValue = [ ...prevValue ];

            const existingUserIdIndex: number = newValue.indexOf(userId);

            if(existingUserIdIndex > -1)
            {
                newValue.splice(existingUserIdIndex, 1)
            }
            else
            {
                newValue.push(userId);
            }

            return newValue;
        });
    }, [ setSelectedFriendsIds ]);

    const sendRoomInvite = (message: string) =>
    {
        if(!selectedFriendsIds.length || !message || !message.length || (message.length > 255)) return;
        
        SendMessageComposer(new SendRoomInviteComposer(message, selectedFriendsIds));

        setShowRoomInvite(false);
    }

    const removeSelectedFriends = () =>
    {
        if(selectedFriendsIds.length === 0) return;

        setSelectedFriendsIds(prevValue =>
        {
            SendMessageComposer(new RemoveFriendComposer(...prevValue));

            return [];
        });

        setShowRemoveFriendsConfirmation(false);
    }

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived: (url: string) =>
            {
                const parts = url.split('/');

                if(parts.length < 2) return;
        
                switch(parts[1])
                {
                    case 'show':
                        setIsVisible(true);
                        setIsFromSearchToolbar(false);
                        return;
                    case 'hide':
                        setIsVisible(false);
                        setIsFromSearchToolbar(false);
                        return;
                    case 'toggle':
                        setIsVisible(prevValue => !prevValue);
                        setIsFromSearchToolbar(false);
                        return;
                    case 'search':
                        setIsVisible(true);
                        setIsFromSearchToolbar(true);
                        return;
                    case 'request':
                        if(parts.length < 4) return;
                        
                        setIsFromSearchToolbar(false);
                        requestFriend(parseInt(parts[2]), parts[3]);
                }
            },
            eventUrlPrefix: 'friends/'
        };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, [ requestFriend ]);

    if(!isVisible) return null;

    return (
        <>
            <NitroCardView className="nitro-friends" uniqueKey="nitro-friends" theme="friendlist">
                <NitroCardHeaderView hideButtonClose headerText={ LocalizeText('friendlist.friends') } onCloseClick={ event => setIsVisible(false) } />
                <NitroCardContentView overflow="hidden" gap={ 1 } className="text-black p-0">
                    <NitroCardAccordionView fullHeight overflow="hidden">
                        <NitroCardAccordionSetView className="friend-headers" headerText={ LocalizeText('friendlist.friends') } isExpanded={ (!isFromSearchToolbar && requests.length === 0) ? true : false } friendlistTab={ FriendListTabs.YOUR_FRIENDS } setShowHoverText={ (e) => setShowHoverText(e) }>
                            <Column className="w-100 h-100 position-relative">
                                <Column overflow="auto" gap={ 0 } style={ { height: 'calc(100% - 40px)' } }>
                                    <NitroCardAccordionSetInnerView headerText={ LocalizeText('friendlist.friends') + ` (${ onlineFriends.length })` } isExpanded={ true }>
                                        <FriendsListGroupView list={ onlineFriends } selectedFriendsIds={ selectedFriendsIds } selectFriend={ selectFriend } setShowHoverText={ (e) => setShowHoverText(e) } />
                                    </NitroCardAccordionSetInnerView>
                                    <NitroCardAccordionSetInnerView headerText={ LocalizeText('friendlist.friends.offlinecaption') + ` (${ offlineFriends.length })` } isExpanded={ true }>
                                        <FriendsListGroupView list={ offlineFriends } selectedFriendsIds={ selectedFriendsIds } selectFriend={ selectFriend } setShowHoverText={ (e) => setShowHoverText(e) } />
                                    </NitroCardAccordionSetInnerView>
                                </Column>
                                <Column className="position-absolute bottom-0 w-100">
                                    <Flex gap={ 1 } className="friend-active-tab p-1">
                                        <div className={ `friend-follow-icon ${ selectedFriendsIds && selectedFriendsIds.length === 0 ? '' : 'active' }` } onClick={ selectedFriendsIds && selectedFriendsIds.length === 0 ? null : () => setShowRoomInvite(true) } onMouseEnter={ selectedFriendsIds && selectedFriendsIds.length === 0 ? null : () => setShowHoverText(LocalizeText('friendlist.tip.invite')) } onMouseLeave={ selectedFriendsIds && selectedFriendsIds.length === 0 ? null : () => setShowHoverText('') } />
                                        <div className={ `friend-profile-icon ${ selectedFriendsIds && selectedFriendsIds.length === 0 ? '' : 'active' }` } onMouseEnter={ selectedFriendsIds && selectedFriendsIds.length === 0 ? null : () => setShowHoverText(LocalizeText('friendlist.tip.home')) } onMouseLeave={ selectedFriendsIds && selectedFriendsIds.length === 0 ? null : () => setShowHoverText('') } />
                                        <div className={ `friend-delete-icon ${ selectedFriendsIds && selectedFriendsIds.length === 0 ? '' : 'active' }` } onClick={ selectedFriendsIds && selectedFriendsIds.length === 0 ? null : () => setShowRemoveFriendsConfirmation(true) } onMouseEnter={ selectedFriendsIds && selectedFriendsIds.length === 0 ? null : () => setShowHoverText(LocalizeText('friendlist.tip.remove')) } onMouseLeave={ selectedFriendsIds && selectedFriendsIds.length === 0 ? null : () => setShowHoverText('') } />
                                    </Flex>
                                </Column>
                            </Column>
                        </NitroCardAccordionSetView>
                        <FriendsListRequestView className="friend-req-headers" headerText={ LocalizeText('friendlist.tab.friendrequests') } isExpanded={ (!isFromSearchToolbar && requests.length > 0) ? true : false } setShowHoverText={ (e) => setShowHoverText(e) } />
                        <FriendsSearchView className="search-headers" headerText={ LocalizeText('people.search.title') } isFromSearchToolbar={ isFromSearchToolbar } setShowHoverText={ (e) => setShowHoverText(e) } />
                    </NitroCardAccordionView>
                </NitroCardContentView>
                <div className="friendlist-bottom p-1 mt-2">{ showHoverText }</div>
            </NitroCardView>
            { showRoomInvite &&
                <FriendsRoomInviteView selectedFriendsIds={ selectedFriendsIds } onCloseClick={ () => setShowRoomInvite(false) } sendRoomInvite={ sendRoomInvite } /> }
            { showRemoveFriendsConfirmation && 
                <FriendsRemoveConfirmationView selectedFriendsIds={ selectedFriendsIds } removeFriendsText={ removeFriendsText } onCloseClick={ () => setShowRemoveFriendsConfirmation(false) } removeSelectedFriends={ removeSelectedFriends } /> }
        </>
    );
};
