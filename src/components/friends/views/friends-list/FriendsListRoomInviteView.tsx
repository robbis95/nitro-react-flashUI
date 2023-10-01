import { FC, useState } from 'react';
import { LocalizeText } from '../../../../api';
import { Button, Column, Flex, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../common';

interface FriendsRoomInviteViewProps
{
    selectedFriendsIds: number[];
    onCloseClick: () => void;
    sendRoomInvite: (message: string) => void;
}

export const FriendsRoomInviteView: FC<FriendsRoomInviteViewProps> = props =>
{
    const { selectedFriendsIds = null, onCloseClick = null, sendRoomInvite = null } = props;
    const [ roomInviteMessage, setRoomInviteMessage ] = useState<string>('');

    return (
        <NitroCardView className="nitro-friends-room-invite no-resize" uniqueKey="nitro-friends-room-invite" theme="friendlist">
            <NitroCardHeaderView hideButtonClose headerText={ LocalizeText('friendlist.invite.title') } onCloseClick={ onCloseClick } />
            <NitroCardContentView className="text-black">
                <Column overflow="hidden" className="px-2 py-2 bg-white rounded" justifyContent="center" alignItems="center">
                    { LocalizeText('friendlist.invite.summary', [ 'count' ], [ selectedFriendsIds.length.toString() ]) }
                    <textarea className="w-100 remove-outline border border-dark textarea-invite" value={ roomInviteMessage } maxLength={ 255 } onChange={ event => setRoomInviteMessage(event.target.value) }></textarea>
                    <Text noWrap className="offset-8">{ LocalizeText('friendlist.invite.note') }</Text>
                </Column>
                <Flex justifyContent="between" alignItems="center">
                    <Button className="volter-bold-button" disabled={ ((roomInviteMessage.length === 0) || (selectedFriendsIds.length === 0)) } onClick={ () => sendRoomInvite(roomInviteMessage) }>{ LocalizeText('friendlist.invite.send') }</Button>
                    <Button className="volter-button" onClick={ onCloseClick }>{ LocalizeText('generic.cancel') }</Button>
                </Flex>
            </NitroCardContentView>
        </NitroCardView>
    );
};
