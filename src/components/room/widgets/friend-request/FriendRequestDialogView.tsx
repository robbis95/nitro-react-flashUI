import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RoomObjectCategory } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { LocalizeText, MessengerRequest } from '../../../../api';
import { Base, Button, Column, Flex, Text } from '../../../../common';
import { useFriends } from '../../../../hooks';
import { ObjectLocationView } from '../object-location/ObjectLocationView';

export const FriendRequestDialogView: FC<{ roomIndex: number, request: MessengerRequest, hideFriendRequest: (userId: number) => void }> = props =>
{
    const { roomIndex = -1, request = null, hideFriendRequest = null } = props;
    const { requestResponse = null } = useFriends();

    return (
        <ObjectLocationView objectId={ roomIndex } category={ RoomObjectCategory.UNIT }>
            <Base className="nitro-friend-request-dialog p-2">
                <Column>
                    <Flex alignItems="center" justifyContent="between" gap={ 2 }>
                        <Text small bold variant="white" className="w-75">{ LocalizeText('widget.friendrequest.from', [ 'username' ], [ request.name ]) }</Text>
                        <i className="friend-req-close" onClick={ event => hideFriendRequest(request.requesterUserId) } />
                    </Flex>
                    <Flex >
                        <Text small className="mt-2 cursor-pointer" underline onClick={ event => requestResponse(request.requesterUserId, false) }>{ LocalizeText('widget.friendrequest.decline') }</Text>
                        <Button className="accept-friend-btn" onClick={ event => requestResponse(request.requesterUserId, true) }>{ LocalizeText('widget.friendrequest.accept') }</Button>
                    </Flex>
                </Column>
            </Base>
        </ObjectLocationView>
    );
}
