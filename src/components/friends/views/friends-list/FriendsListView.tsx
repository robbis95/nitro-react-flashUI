import { ILinkEventTracker, RemoveFriendComposer, SendRoomInviteComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { AddEventLinkTracker, LocalizeText, MessengerFriend, RemoveLinkEventTracker, SendMessageComposer } from '../../../../api';
import { Button, Flex, NitroCardContentView, NitroCardHeaderView, NitroCardTabsItemView, NitroCardTabsView, NitroCardView } from '../../../../common';
import { useFriends } from '../../../../hooks';
import { FriendsListGroupView } from './friends-list-group/FriendsListGroupView';
import { FriendsListRequestView } from './friends-list-request/FriendsListRequestView';
import { FriendsRemoveConfirmationView } from './FriendsListRemoveConfirmationView';
import { FriendsRoomInviteView } from './FriendsListRoomInviteView';
import { FriendsSearchView } from './FriendsListSearchView';

const TAB_FRIENDS: string = 'friendlist.friends';
const TAB_OFFLINE: string = 'friendlist.friends.offlinecaption';
const TAB_REQUESTS: string = 'friendlist.tab.friendrequests';
const TAB_SEARCH: string = 'people.search.title';
const TABS = [ TAB_FRIENDS, TAB_OFFLINE, TAB_REQUESTS, TAB_SEARCH ];

export const FriendsListView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const [ currentTab, setCurrentTab ] = useState<string>(TABS[0]);
    const [ selectedFriendsIds, setSelectedFriendsIds ] = useState<number[]>([]);
    const [ showRoomInvite, setShowRoomInvite ] = useState<boolean>(false);
    const [ showRemoveFriendsConfirmation, setShowRemoveFriendsConfirmation ] = useState<boolean>(false);
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
                        return;
                    case 'hide':
                        setIsVisible(false);
                        return;
                    case 'toggle':
                        setIsVisible(prevValue => !prevValue);
                        return;
                    case 'request':
                        if(parts.length < 4) return;

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
            <NitroCardView className="nitro-friends" uniqueKey="nitro-friends">
                    <NitroCardHeaderView headerText={ LocalizeText('friendlist.friends.title') } onCloseClick={ event => setIsVisible(false) } />
                    <NitroCardTabsView>
                        { TABS.map((name, index) =>
                            {
                                return (
                                    <NitroCardTabsItemView key={ index } isActive={ (currentTab === name) } onClick={ event => setCurrentTab(name) }>
                                        { LocalizeText(name) }
                                    </NitroCardTabsItemView>
                                );
                            }) }
                    </NitroCardTabsView>
                    <NitroCardContentView gap={ 1 } className="text-black pt-0 px-0 friends-list">
                        { (currentTab === TAB_FRIENDS ) &&
                            <FriendsListGroupView list={ onlineFriends } selectedFriendsIds={ selectedFriendsIds } selectFriend={ selectFriend } /> }
                        { (currentTab === TAB_OFFLINE ) &&
                            <FriendsListGroupView list={ offlineFriends } selectedFriendsIds={ selectedFriendsIds } selectFriend={ selectFriend } /> }
                        { (currentTab === TAB_REQUESTS ) && 
                            <FriendsListRequestView headerText={ LocalizeText('friendlist.tab.friendrequests') + ` (${ requests.length })` } /> }
                        { (currentTab === TAB_SEARCH ) && 
                            <FriendsSearchView headerText={ LocalizeText('people.search.title') } /> }
                        { selectedFriendsIds && selectedFriendsIds.length > 0 &&
                            <Flex gap={ 1 } className="p-1 selected-friends">
                                <Button fullWidth onClick={ () => setShowRoomInvite(true) }>{ LocalizeText('friendlist.tip.invite') }</Button>
                                <Button fullWidth variant="danger" onClick={ event => setShowRemoveFriendsConfirmation(true) }>{ LocalizeText('generic.delete') }</Button>
                            </Flex> } 
                    </NitroCardContentView>
            </NitroCardView>
            { showRoomInvite &&
                <FriendsRoomInviteView selectedFriendsIds={ selectedFriendsIds } onCloseClick={ () => setShowRoomInvite(false) } sendRoomInvite={ sendRoomInvite } /> }
            { showRemoveFriendsConfirmation && 
                <FriendsRemoveConfirmationView selectedFriendsIds={ selectedFriendsIds } removeFriendsText={ removeFriendsText } onCloseClick={ () => setShowRemoveFriendsConfirmation(false) } removeSelectedFriends={ removeSelectedFriends } /> }
        </>
    );
};
