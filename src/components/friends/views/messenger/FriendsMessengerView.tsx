import { FollowFriendFailedEvent, FollowFriendMessageComposer, ILinkEventTracker } from '@nitrots/nitro-renderer';
import { FC, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { AddEventLinkTracker, GetSessionDataManager, GetUserProfile, LocalizeText, MessengerFollowFriendFailedType, RemoveLinkEventTracker, ReportType, SendMessageComposer } from '../../../../api';
import { ButtonGroup, Column, Flex, LayoutAvatarImageView, LayoutBadgeImageView, LayoutItemCountView, NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../common';
import { LayoutMessengerGrid } from '../../../../common/layout/LayoutMessengerGrid';
import { useHelp, useMessageEvent, useMessenger, useNotification } from '../../../../hooks';
import { FriendsMessengerThreadView } from './messenger-thread/FriendsMessengerThreadView';

export const FriendsMessengerView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const [ lastThreadId, setLastThreadId ] = useState(-1);
    const [ messageText, setMessageText ] = useState('');
    const { visibleThreads = [], activeThread = null, getMessageThread = null, sendMessage = null, setActiveThreadId = null, closeThread = null } = useMessenger();
    const { simpleAlert = null } = useNotification();
    const { report = null } = useHelp();
    const messagesBox = useRef<HTMLDivElement>();

    const followFriend = () => (activeThread && activeThread.participant && SendMessageComposer(new FollowFriendMessageComposer(activeThread.participant.id)));
    const openProfile = () => (activeThread && activeThread.participant && GetUserProfile(activeThread.participant.id));

    const send = () =>
    {
        if(!activeThread || !messageText.length) return;

        sendMessage(activeThread, GetSessionDataManager().userId, messageText);

        setMessageText('');
    }

    const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) =>
    {
        if(event.key !== 'Enter') return;

        send();
    }

    useMessageEvent<FollowFriendFailedEvent>(FollowFriendFailedEvent, event =>
    {
        const parser = event.getParser();

        if (!parser) return null;

        switch(parser.errorCode)
        {
            case MessengerFollowFriendFailedType.NOT_IN_FRIEND_LIST:
                simpleAlert(LocalizeText('friendlist.followerror.notfriend'), null, null, null, LocalizeText('friendlist.alert.title'), null);
                break;
            case MessengerFollowFriendFailedType.FRIEND_OFFLINE:
                simpleAlert(LocalizeText('friendlist.followerror.offline'), null, null, null, LocalizeText('friendlist.alert.title'), null);
                break;
            case MessengerFollowFriendFailedType.FRIEND_NOT_IN_ROOM:
                simpleAlert(LocalizeText('friendlist.followerror.hotelview'), null, null, null, LocalizeText('friendlist.alert.title'), null);
                break;
            case MessengerFollowFriendFailedType.FRIEND_BLOCKED_STALKING:
                simpleAlert(LocalizeText('friendlist.followerror.prevented'), null, null, null, LocalizeText('friendlist.alert.title'), null);
                break;
        }
    });

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived: (url: string) =>
            {
                const parts = url.split('/');

                if(parts.length === 2)
                {
                    if(parts[1] === 'open')
                    {
                        setIsVisible(true);

                        return;
                    }

                    if(parts[1] === 'toggle')
                    {
                        setIsVisible(prevValue => !prevValue);

                        return;
                    }

                    const thread = getMessageThread(parseInt(parts[1]));

                    if(!thread) return;

                    setActiveThreadId(thread.threadId);
                    setIsVisible(true);
                }
            },
            eventUrlPrefix: 'friends-messenger/'
        };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, [ getMessageThread, setActiveThreadId ]);

    useEffect(() =>
    {
        if(!isVisible || !activeThread) return;

        messagesBox.current.scrollTop = messagesBox.current.scrollHeight;
    }, [ isVisible, activeThread ]);

    useEffect(() =>
    {
        if (visibleThreads.length === 0) setIsVisible(false);
        
    }, [ visibleThreads ]);

    useEffect(() =>
    {
        if(isVisible && !activeThread)
        {
            if(lastThreadId > 0)
            {
                setActiveThreadId(lastThreadId);
            }
            else
            {
                if(visibleThreads.length > 0) setActiveThreadId(visibleThreads[0].threadId);
            }

            return;
        }

        if(!isVisible && activeThread)
        {
            setLastThreadId(activeThread.threadId);
            setActiveThreadId(-1);
        }
    }, [ isVisible, activeThread, lastThreadId, visibleThreads, setActiveThreadId ]);

    if(!isVisible) return null;

    return (
        <NitroCardView className="nitro-friends-messenger" uniqueKey="nitro-friends-messenger" theme="messenger">
            <NitroCardHeaderView headerText={ LocalizeText('messenger.window.title', [ 'OPEN_CHAT_COUNT' ], [ visibleThreads.length.toString() ]) } hideButtonClose={ true } onCloseClick={ event => setIsVisible(false) } />
            <NitroCardContentView>
                <Column fullWidth size={ 4 }>
                    <div className="d-flex h-100 overflow-auto gap-2">
                        { visibleThreads && (visibleThreads.length > 0) && visibleThreads.map(thread =>
                        {
                            return (
                                <LayoutMessengerGrid key={ thread.threadId } itemActive={ (activeThread === thread) } onClick={ event => setActiveThreadId(thread.threadId) }>
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
                        }) }
                    </div>
                </Column>
                <Column size={ 8 } overflow="hidden" className="w-100">
                    { activeThread &&
                            <>
                                <div className="messenger-line">
                                    <p className="nitro-messenger-header-text fw-bold">{ LocalizeText('messenger.window.separator', [ 'FRIEND_NAME' ], [ activeThread.participant.name ]) }</p></div>
                                <Flex alignItems="center" justifyContent="between" gap={ 1 }>
                                    <Flex gap={ 1 }>
                                        <ButtonGroup className="gap-1">
                                            <button className="follow" title={ LocalizeText('messenger.followfriend.tooltip') } onClick={ followFriend } />
                                            <button className="profile" title={ LocalizeText('guide.help.common.profile.tooltip') } onClick={ openProfile } />
                                        </ButtonGroup>
                                        <button className="report" title={ LocalizeText('messenger.window.button.report.tooltip') } onClick={ () => report(ReportType.IM, { reportedUserId: activeThread.participant.id }) }>
                                            { LocalizeText('messenger.window.button.report') }
                                        </button>
                                    </Flex>
                                    <button className="clear" onClick={ event => closeThread(activeThread.threadId) } />
                                </Flex>
                                <Column fit className="chat-messages">
                                    <Column innerRef={ messagesBox } overflow="auto">
                                        <FriendsMessengerThreadView thread={ activeThread } />
                                    </Column>
                                </Column>
                                <Flex gap={ 1 }>
                                    <input type="text" className="chat-input-form form-control-sm" maxLength={ 255 } placeholder={ LocalizeText('messenger.window.input.default', [ 'FRIEND_NAME' ], [ activeThread.participant.name ]) } value={ messageText } onChange={ event => setMessageText(event.target.value) } onKeyDown={ onKeyDown } />
                                    <button className="messenger-button chat-submit fw-bold px-3" onClick={ send }>
                                        { LocalizeText('widgets.chatinput.say') }
                                    </button>
                                </Flex>
                            </> }
                </Column>
            </NitroCardContentView>
        </NitroCardView>
    );
}
