import { FC } from 'react';
import { LocalizeText, MessengerRequest } from '../../../../../api';
import { Base, Flex, NitroCardAccordionItemView, UserProfileIconView } from '../../../../../common';
import { useFriends } from '../../../../../hooks';

interface FriendsListRequestItemViewProps
{
    request: MessengerRequest;
    setShowHoverText?: (text: string) => void;
}

export const FriendsListRequestItemView: FC<FriendsListRequestItemViewProps> = props =>
{
    const { request = null, setShowHoverText = null } = props;
    const { requestResponse = null } = useFriends();

    if(!request) return null;

    return (
        <NitroCardAccordionItemView justifyContent="between" className="px-1 py-1 friend-tab" onMouseEnter={ () => setShowHoverText(LocalizeText('infostand.profile.link.tooltip')) } onMouseLeave={ () => setShowHoverText('') }>
            <Flex alignItems="center" gap={ 1 }>
                <UserProfileIconView userId={ request.id } />
                <div>{ request.name }</div>
            </Flex>
            <Flex alignItems="center" gap={ 2 }>
                <Base className="nitro-friends-spritesheet icon icon-accept-check cursor-pointer" onClick={ event => requestResponse(request.id, true) } onMouseEnter={ () => setShowHoverText(LocalizeText('friendbar.request.accept')) } onMouseLeave={ () => setShowHoverText('') } />
                <Base className="nitro-friends-spritesheet icon icon-decline-x cursor-pointer" onClick={ event => requestResponse(request.id, false) } onMouseEnter={ () => setShowHoverText(LocalizeText('friendbar.request.decline')) } onMouseLeave={ () => setShowHoverText('') } />
            </Flex>
        </NitroCardAccordionItemView>
    );
}
