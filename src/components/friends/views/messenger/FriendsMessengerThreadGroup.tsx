import { FC, useMemo } from 'react';
import { GetSessionDataManager, LocalizeText } from '../../../../api';
import { Base, Flex, LayoutAvatarImageView } from '../../../../common';
import { GroupType } from '../../common/GroupType';
import { MessengerThread } from '../../common/MessengerThread';
import { MessengerThreadChat } from '../../common/MessengerThreadChat';
import { MessengerThreadChatGroup } from '../../common/MessengerThreadChatGroup';
import { getGroupChatData } from '../../common/Utils';

interface FriendsMessengerThreadGroupProps
{
    thread: MessengerThread;
    group: MessengerThreadChatGroup;
}

export const FriendsMessengerThreadGroup: FC<FriendsMessengerThreadGroupProps> = props =>
{
    const { thread = null, group = null } = props;

    const isOwnChat = useMemo(() =>
    {
        if(!thread || !group) return false;
        
        if(group.type === GroupType.PRIVATE_CHAT && (group.userId === GetSessionDataManager().userId)) return true;

        if( (group.type === GroupType.GROUP_CHAT) && (group.chats.length && getGroupChatData(group.chats[0].extraData).userId === GetSessionDataManager().userId)) return true;

        return false;
    }, [group, thread]);

    if(!thread || !group) return null;
    
    if(!group.userId)
    {
        return (
                <>
                { group.chats.map((chat, index) =>
                    {
                        return (
                            <div className="d-flex gap-2 w-100 justify-content-start">
                                <Base key={ index } className="w-100 text-break">
                                    { chat.type === MessengerThreadChat.SECURITY_NOTIFICATION &&
                                        <Base className="thread-message mb-2 d-flex gap-2 px-2 py-1 align-items-center">
                                            <Base className="nitro-friends-spritesheet icon-warning flex-shrink-0 px-3" />
                                            <Base>{ chat.message }</Base>
                                        </Base> }
                                    { chat.type === MessengerThreadChat.ROOM_INVITE &&
                                            <Base className="bg-light rounded mb-2 d-flex gap-2 px-2 py-1 small text-black align-items-center">
                                            <Base className="messenger-notification-icon flex-shrink-0" />
                                            <Base>{(LocalizeText('messenger.invitation') + ' ') }{ chat.message }</Base>
                                        </Base> }
                                </Base>
                            </div>
                        );
                    }) }
            </>
        );
    }
    
    return (
        <Flex className={ 'w-100 justify-content-' + (isOwnChat ? 'end' : 'start') } gap={ 2 }>
                <Base className="message-avatar flex-shrink-0">
                { (group.type === GroupType.PRIVATE_CHAT && !isOwnChat) &&
                    <LayoutAvatarImageView figure={ thread.participant.figure } direction={ 2 } />
                }
                { (group.type === GroupType.GROUP_CHAT && !isOwnChat) &&
                    <LayoutAvatarImageView figure={ getGroupChatData(group.chats[0].extraData).figure } direction={ 2} />
                }
                </Base>
            <Base className={ 'message-bubble text-black mt-2 py-1 px-2 messages-group-' + (isOwnChat ? 'right' : 'left') }>
                <Base className='fw-bold username'>
                    { (isOwnChat) && GetSessionDataManager().userName }
                    { (!isOwnChat) && ((group.type === GroupType.GROUP_CHAT) ? getGroupChatData(group.chats[0].extraData).username : thread.participant.name)
                    }
                </Base>
                { group.chats.map((chat, index) =><Base key={ index } className="text-break">{ chat.message }</Base>) }
            </Base>
            { (isOwnChat) &&
                <Base className="message-avatar flex-shrink-0">
                    <LayoutAvatarImageView figure={ GetSessionDataManager().figure } direction={ 4 } />
                </Base> }
        </Flex>
    );
}
