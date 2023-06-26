import { FC, MouseEvent, useState } from 'react';
import { LocalizeText, MessengerFriend, OpenMessengerChat } from '../../../../../api';
import { Base, Column, Flex, LayoutAvatarImageView, NitroCardAccordionItemView, Text, UserProfileIconView } from '../../../../../common';
import { useFriends } from '../../../../../hooks';

interface FriendsListGroupItemViewProps
{
    friend: MessengerFriend;
    selected: boolean;
    selectFriend: (userId: number) => void;
    setShowHoverText?: (text: string) => void;
}

export const FriendsListGroupItemView: FC<FriendsListGroupItemViewProps> = props =>
{
    const { friend = null, selected = false, selectFriend = null, setShowHoverText = null } = props;
    const [ isRelationshipOpen, setIsRelationshipOpen ] = useState<boolean>(false);
    const { followFriend = null, updateRelationship = null } = useFriends();

    const clickFollowFriend = (event: MouseEvent<HTMLDivElement>) =>
    {
        event.stopPropagation();

        followFriend(friend);
    }

    const openMessengerChat = (event: MouseEvent<HTMLDivElement>) =>
    {
        event.stopPropagation();
        
        OpenMessengerChat(friend.id);
    }

    const openRelationship = (event: MouseEvent<HTMLDivElement>) =>
    {
        event.stopPropagation();

        setIsRelationshipOpen(true);
    }

    const clickUpdateRelationship = (event: MouseEvent<HTMLDivElement>, type: number) =>
    {
        event.stopPropagation();

        updateRelationship(friend, type);
        
        setIsRelationshipOpen(false);
    }

    const getCurrentRelationshipName = () =>
    {
        if(!friend) return null;

        switch(friend.relationshipStatus)
        {
            case MessengerFriend.RELATIONSHIP_HEART: return 'heart';
            case MessengerFriend.RELATIONSHIP_SMILE: return 'smile';
            case MessengerFriend.RELATIONSHIP_BOBBA: return 'bobba';
            default: return null;
        }
    }

    if(!friend) return null;

    return (
        <NitroCardAccordionItemView justifyContent="between" className={ `friend-tab px-2 py-1 ${ selected && 'selected-user text-white' }` } onClick={ event => selectFriend(friend.id) }>
            <Flex alignItems="center" gap={ 0 }>
                { (friend.id > 0 && friend.online) &&
                    <Flex center pointer className="avatar">
                        <LayoutAvatarImageView headOnly figure={ friend.figure } direction={ 2 } scale={ 0.5 } />
                    </Flex>
                }
                <Base style={ { marginLeft: (friend.id < 0 || !friend.online) ? '14px' : '' } } onClick={ event => event.stopPropagation() } onMouseEnter={ () => setShowHoverText(LocalizeText('infostand.profile.link.tooltip')) } onMouseLeave={ () => setShowHoverText('') }>
                    <UserProfileIconView userId={ friend.id } />
                </Base>
                <Text variant="black" className="ms-1">{ friend.name }</Text>
            </Flex>
            <Flex alignItems="center" gap={ 1 }>
                <Flex className={ !friend.followingAllowed ? 'pe-4' : 'pe-1' } onClick={ openRelationship } onMouseEnter={ () => setShowHoverText(LocalizeText('infostand.link.relationship')) } onMouseLeave={ () => setShowHoverText('') }>
                    { (friend.id > 0) && <Base className={ `nitro-friends-spritesheet icon-${ getCurrentRelationshipName() }` } /> }
                    { (friend.id > 0) && <Base className="icon icon-friendlist_arrow_black_down" /> }
                </Flex>
                { friend.followingAllowed && <Base pointer onClick={ clickFollowFriend } className="nitro-friends-spritesheet icon-follow" onMouseEnter={ () => setShowHoverText(LocalizeText('friendlist.tip.follow')) } onMouseLeave={ () => setShowHoverText('') } /> }
                <Base pointer className="nitro-friends-spritesheet icon icon-friend_message" onClick={ openMessengerChat } onMouseEnter={ () => setShowHoverText(LocalizeText('friendlist.tip.im')) } onMouseLeave={ () => setShowHoverText('') } />
                { isRelationshipOpen &&
                    <>
                        <Column position="absolute" className="select-relation">
                            <Base pointer className="nitro-friends-spritesheet icon-none" onClick={ event => clickUpdateRelationship(event, MessengerFriend.RELATIONSHIP_NONE) } />
                            <Base pointer className="nitro-friends-spritesheet icon-heart bg-white w-100" onClick={ event => clickUpdateRelationship(event, MessengerFriend.RELATIONSHIP_HEART) } />
                            <Base pointer className="nitro-friends-spritesheet icon-smile" onClick={ event => clickUpdateRelationship(event, MessengerFriend.RELATIONSHIP_SMILE) } />
                            <Base pointer className="nitro-friends-spritesheet icon-bobba bg-white w-100" onClick={ event => clickUpdateRelationship(event, MessengerFriend.RELATIONSHIP_BOBBA) } />
                        </Column>
                    </>
                }
            </Flex>
        </NitroCardAccordionItemView>
    );
}
