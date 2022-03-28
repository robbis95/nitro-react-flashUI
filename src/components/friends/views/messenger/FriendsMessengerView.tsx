import { FollowFriendMessageComposer, ILinkEventTracker, NewConsoleMessageEvent, RoomInviteErrorEvent, RoomInviteEvent, SendMessageComposer as SendMessageComposerPacket } from '@nitrots/nitro-renderer';
import { FC, KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AddEventLinkTracker, GetSessionDataManager, GetUserProfile, LocalizeText, NotificationAlertType, NotificationUtilities, PlaySound, RemoveLinkEventTracker, SendMessageComposer, SoundNames } from '../../../../api';
import { Button, ButtonGroup, Column, Flex, LayoutAvatarImageView, LayoutBadgeImageView, LayoutItemCountView, NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../common';
import { LayoutMessengerGrid } from '../../../../common/layout/LayoutMessengerGrid';
import { FriendsMessengerIconEvent } from '../../../../events';
import { BatchUpdates, DispatchUiEvent, UseMessageEventHook } from '../../../../hooks';
import { MessengerThread } from '../../common/MessengerThread';
import { MessengerThreadChat } from '../../common/MessengerThreadChat';
import { useFriendsContext } from '../../FriendsContext';
import { FriendsMessengerThreadView } from './FriendsMessengerThreadView';

export const FriendsMessengerView: FC<{}> = props =>
{
    const [isVisible, setIsVisible] = useState(false);
    const [messageThreads, setMessageThreads] = useState<MessengerThread[]>([]);
    const [activeThreadIndex, setActiveThreadIndex] = useState(-1);
    const [hiddenThreadIndexes, setHiddenThreadIndexes] = useState<number[]>([]);
    const [messageText, setMessageText] = useState('');
    const [updateValue, setUpdateValue] = useState({});
    const { friends = [] } = useFriendsContext();
    const messagesBox = useRef<HTMLDivElement>();

    const followFriend = useCallback(() =>
    {
        SendMessageComposer(new FollowFriendMessageComposer(messageThreads[activeThreadIndex].participant.id));
    }, [messageThreads, activeThreadIndex]);

    const openProfile = useCallback(() =>
    {
        GetUserProfile(messageThreads[activeThreadIndex].participant.id);
    }, [messageThreads, activeThreadIndex]);

    const getFriend = useCallback((userId: number) =>
    {
        return ((friends.find(friend => (friend.id === userId))) || null);
    }, [friends]);

    const visibleThreads = useMemo(() =>
    {
        return messageThreads.filter((thread, index) =>
        {
            if(hiddenThreadIndexes.indexOf(index) >= 0) return false;

            return true;
        });
    }, [messageThreads, hiddenThreadIndexes]);

    const getMessageThreadWithIndex = useCallback<(userId: number) => [number, MessengerThread]>((userId: number) =>
    {
        if(messageThreads.length > 0)
        {
            for(let i = 0; i < messageThreads.length; i++)
            {
                const thread = messageThreads[i];

                if(thread.participant && (thread.participant.id === userId))
                {
                    const hiddenIndex = hiddenThreadIndexes.indexOf(i);

                    if(hiddenIndex >= 0)
                    {
                        setHiddenThreadIndexes(prevValue =>
                        {
                            const newIndexes = [...prevValue];

                            newIndexes.splice(hiddenIndex, 1);

                            return newIndexes;
                        });
                    }

                    return [i, thread];
                }
            }
        }

        const friend = getFriend(userId);

        if(!friend) return [-1, null];

        const thread = new MessengerThread(friend);
        const newThreads = [...messageThreads, thread];

        setMessageThreads(newThreads);

        return [(newThreads.length - 1), thread];
    }, [messageThreads, hiddenThreadIndexes, getFriend]);

    const onNewConsoleMessageEvent = useCallback((event: NewConsoleMessageEvent) =>
    {
        const parser = event.getParser();
        const [threadIndex, thread] = getMessageThreadWithIndex(parser.senderId);

        if((threadIndex === -1) || !thread) return;

        thread.addMessage(parser.senderId, parser.messageText, parser.secondsSinceSent, parser.extraData);

        setMessageThreads(prevValue => [...prevValue]);
    }, [getMessageThreadWithIndex]);

    UseMessageEventHook(NewConsoleMessageEvent, onNewConsoleMessageEvent);

    const onRoomInviteEvent = useCallback((event: RoomInviteEvent) =>
    {
        const parser = event.getParser();

        const [threadIndex, thread] = getMessageThreadWithIndex(parser.senderId);

        if((threadIndex === -1) || !thread) return;

        thread.addMessage(null, parser.messageText, 0, null, MessengerThreadChat.ROOM_INVITE);

        setMessageThreads(prevValue => [...prevValue]);
    }, [getMessageThreadWithIndex]);

    UseMessageEventHook(RoomInviteEvent, onRoomInviteEvent);

    const onRoomInviteErrorEvent = useCallback((event: RoomInviteErrorEvent) =>
    {
        const parser = event.getParser();
        const message = ((('Received room invite error: errorCode: ' + parser.errorCode) + ', recipients: ') + parser.failedRecipients);
            
        NotificationUtilities.simpleAlert(message, NotificationAlertType.DEFAULT, null, null, LocalizeText('friendlist.alert.title'));
    }, []);

    UseMessageEventHook(RoomInviteErrorEvent, onRoomInviteErrorEvent);

    const sendMessage = useCallback(() =>
    {
        if(!messageText || !messageText.length) return;

        if(activeThreadIndex === -1) return;

        const thread = messageThreads[activeThreadIndex];

        if(!thread) return;

        SendMessageComposer(new SendMessageComposerPacket(thread.participant.id, messageText));

        if(messageThreads.length === 1 && thread.groups.length === 1) PlaySound(SoundNames.MESSENGER_NEW_THREAD);

        thread.addMessage(GetSessionDataManager().userId, messageText, 0, null, MessengerThreadChat.CHAT);

        BatchUpdates(() =>
        {
            setMessageThreads(prevValue => [...prevValue]);
            setMessageText('');
        });
    }, [messageThreads, activeThreadIndex, messageText]);

    const onKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) =>
    {
        if(event.key !== 'Enter') return;

        sendMessage();
    }, [sendMessage]);

    const linkReceived = useCallback((url: string) =>
    {
        const parts = url.split('/');

        if(parts.length < 3) return;

        if(parts[2] === 'open')
        {
            setIsVisible(true);

            return;
        }

        const [threadIndex] = getMessageThreadWithIndex(parseInt(parts[2]));

        if(threadIndex === -1) return;

        BatchUpdates(() =>
        {
            setActiveThreadIndex(threadIndex);
            setIsVisible(true);
        });
    }, [getMessageThreadWithIndex]);

    const closeThread = useCallback((threadIndex: number) =>
    {
        setHiddenThreadIndexes(prevValue =>
        {
            const values = [...prevValue];

            if(values.indexOf(threadIndex) === -1) values.push(threadIndex);

            return values;
        });
    }, []);

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived,
            eventUrlPrefix: 'friends/messenger/'
        };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, [linkReceived]);

    useEffect(() =>
    {
        if(!isVisible) return;

        if(activeThreadIndex === -1) setActiveThreadIndex(0);
    }, [isVisible, activeThreadIndex]);

    useEffect(() =>
    {
        if(hiddenThreadIndexes.indexOf(activeThreadIndex) >= 0) setActiveThreadIndex(0);
    }, [activeThreadIndex, hiddenThreadIndexes]);

    useEffect(() =>
    {
        if(!isVisible || (activeThreadIndex === -1)) return;

        const activeThread = messageThreads[activeThreadIndex];

        if(!activeThread) return;

        if(activeThread.unread)
        {
            messagesBox.current.scrollTop = messagesBox.current.scrollHeight;
            activeThread.setRead();
            setUpdateValue({});
        }
    }, [isVisible, messageThreads, activeThreadIndex]);

    useEffect(() =>
    {
        if(!visibleThreads.length)
        {
            setIsVisible(false);

            DispatchUiEvent(new FriendsMessengerIconEvent(FriendsMessengerIconEvent.UPDATE_ICON, FriendsMessengerIconEvent.HIDE_ICON));

            return;
        }

        let isUnread = false;

        for(const thread of visibleThreads)
        {
            if(thread.unreadCount > 0)
            {
                isUnread = true;

                break;
            }
        }

        if(isUnread) PlaySound(SoundNames.MESSENGER_MESSAGE_RECEIVED);

        DispatchUiEvent(new FriendsMessengerIconEvent(FriendsMessengerIconEvent.UPDATE_ICON, isUnread ? FriendsMessengerIconEvent.UNREAD_ICON : FriendsMessengerIconEvent.SHOW_ICON));
    }, [visibleThreads, updateValue]);

    if(!isVisible) return null;

    return (
        <NitroCardView className="nitro-friends-messenger" uniqueKey="nitro-friends-messenger" theme="messenger">
            <NitroCardHeaderView headerText={LocalizeText('messenger.window.title', ['OPEN_CHAT_COUNT'], [visibleThreads.length.toString()])} onCloseClick={event => setIsVisible(false)} />
            <NitroCardContentView>
                    <Column fullWidth size={ 4 }>
                        <div className="d-flex h-100 overflow-auto gap-2">
                            { visibleThreads && (visibleThreads.length > 0) && visibleThreads.map((thread, index) =>
                            {
                                const messageThreadIndex = messageThreads.indexOf(thread);

                                return (
                                    <LayoutMessengerGrid key={ index } itemActive={ (activeThreadIndex === messageThreadIndex) } onClick={ event => setActiveThreadIndex(messageThreadIndex) }>
                                        { thread.unread &&
                                            <LayoutItemCountView count={ thread.unreadCount } /> }
                                        <Flex fullWidth alignItems="center" gap={ 1 }>
                                            <Flex alignItems="center" className="friend-head px-1">
                                                { (thread.participant.id > 0) &&
                                                    <LayoutAvatarImageView figure={ thread.participant.figure } headOnly={ true } direction={ 2 } /> }
                                                { (thread.participant.id <= 0) &&
                                                    <LayoutBadgeImageView isGroup={ true } badgeCode={ thread.participant.figure } /> }
                                            </Flex>
                                        </Flex>
                                    </LayoutMessengerGrid>
                                );
                            })}
                        </div>
                    </Column>
                    <Column size={ 8 } overflow="hidden" className="w-100">
                        { visibleThreads && (visibleThreads.length > 0) && (activeThreadIndex >= 0) &&
                            <>
                                <div className="messenger-line">
                                <p className="nitro-messenger-header-text fw-bold">{ LocalizeText('messenger.window.separator', [ 'FRIEND_NAME' ], [ messageThreads[activeThreadIndex].participant.name ]) }</p></div>
                                <Flex alignItems="center" justifyContent="between" gap={ 1 }>
                                    <Flex gap={ 1 }>
                                        <ButtonGroup className="gap-1">
                                            <button className="follow" onClick={ followFriend } />
                                            <button className="profile" onClick={ openProfile } />
                                        </ButtonGroup>
                                        <button className="messenger-button fw-bold px-3" onClick={ openProfile }>
                                            {LocalizeText('messenger.window.button.report')}
                                        </button>
                                    </Flex>
                                    <button className="clear" onClick={ event => closeThread(activeThreadIndex) }/>
                                </Flex>
                                <Column fit className="chat-messages">
                                    <Column innerRef={ messagesBox } overflow="auto">
                                        <FriendsMessengerThreadView thread={ messageThreads[activeThreadIndex] } />
                                    </Column>
                                </Column>
                                <Flex gap={ 1 }>
                                    <input type="text" className="chat-input-form form-control-sm" maxLength={ 255 } placeholder={ LocalizeText('messenger.window.input.default', [ 'FRIEND_NAME' ], [ messageThreads[activeThreadIndex].participant.name ]) } value={ messageText } onChange={ event => setMessageText(event.target.value) } onKeyDown={ onKeyDown } />
                                    <button className="messenger-button chat-submit fw-bold px-3" onClick={ sendMessage }>
                                        { LocalizeText('widgets.chatinput.say') }
                                    </button>
                                </Flex>
                            </> }
                    </Column>
            </NitroCardContentView>
        </NitroCardView>
    );
}
