import { FC, MouseEvent, useState } from 'react';
import { LocalizeText, MessengerFriend, OpenMessengerChat } from '../../../../../api';
import { Base, Flex, NitroCardAccordionItemView, UserProfileIconView, LayoutAvatarImageView } from '../../../../../common';
import { useFriends } from '../../../../../hooks';

export const FriendsListGroupItemView: FC<{ friend: MessengerFriend, selected: boolean, selectFriend: (userId: number) => void }> = props => {
    const { friend = null, selected = false, selectFriend = null } = props;
    const [isRelationshipOpen, setIsRelationshipOpen] = useState<boolean>(false);
    const { followFriend = null, updateRelationship = null } = useFriends();

    const clickFollowFriend = (event: MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        followFriend(friend);
    }

    const openMessengerChat = (event: MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        OpenMessengerChat(friend.id);
    }

    const openRelationship = (event: MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        setIsRelationshipOpen(true);
    }

    const clickUpdateRelationship = (event: MouseEvent<HTMLDivElement>, type: number) => {
        event.stopPropagation();
        updateRelationship(friend, type);
        setIsRelationshipOpen(false);
    }

    const getCurrentRelationshipName = () => {
        if (!friend) return 'none';

        switch (friend.relationshipStatus) {
            case MessengerFriend.RELATIONSHIP_HEART: return 'heart';
            case MessengerFriend.RELATIONSHIP_SMILE: return 'smile';
            case MessengerFriend.RELATIONSHIP_BOBBA: return 'bobba';
            default: return 'none';
        }
    }

    if (!friend) return null;

    const FriendAvatar = friend.online ? (
        <Flex center pointer className="avatar">
            <LayoutAvatarImageView headOnly figure={friend.figure} direction={2} scale={0.5} />
        </Flex>
    ) : (
        <UserProfileIconView userId={friend.id} />
    );

    return (
        <NitroCardAccordionItemView justifyContent="between" className={`friend-tab px-2 py-1 ${selected && 'bg-primary text-white'}`} onClick={event => selectFriend(friend.id)}>
            <Flex alignItems="center" gap={1}>
                <Base onClick={event => event.stopPropagation()}>
                    {FriendAvatar}
                </Base>
                <div>{friend.name}</div>
            </Flex>
            <Flex alignItems="center" gap={1}>
                {!isRelationshipOpen && (
                    <>
                        {friend.followingAllowed && (
                            <Base pointer onClick={clickFollowFriend} className="nitro-friends-spritesheet icon-follow" title={LocalizeText('friendlist.tip.follow')} />
                        )}
                        {friend.online && (
                            <Base pointer className="nitro-friends-spritesheet icon-chat" onClick={openMessengerChat} title={LocalizeText('friendlist.tip.im')} />
                        )}
                        {friend.id > 0 && (
                            <Base className={`nitro-friends-spritesheet icon-${getCurrentRelationshipName()} cursor-pointer`} onClick={openRelationship} title={LocalizeText('infostand.link.relationship')} />
                        )}
                    </>
                )}
                {isRelationshipOpen && (
                    <>
                        <Base pointer className="nitro-friends-spritesheet icon-heart" onClick={event => clickUpdateRelationship(event, MessengerFriend.RELATIONSHIP_HEART)} />
                        <Base pointer className="nitro-friends-spritesheet icon-smile" onClick={event => clickUpdateRelationship(event, MessengerFriend.RELATIONSHIP_SMILE)} />
                        <Base pointer className="nitro-friends-spritesheet icon-bobba" onClick={event => clickUpdateRelationship(event, MessengerFriend.RELATIONSHIP_BOBBA)} />
                        <Base pointer className="nitro-friends-spritesheet icon-none" onClick={event => clickUpdateRelationship(event, MessengerFriend.RELATIONSHIP_NONE)} />
                    </>
                )}
            </Flex>
        </NitroCardAccordionItemView>
    );
};
