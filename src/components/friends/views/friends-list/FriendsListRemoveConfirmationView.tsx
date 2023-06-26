import { FC } from 'react';
import { LocalizeText } from '../../../../api';
import { Button, Column, Flex, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../common';

interface FriendsRemoveConfirmationViewProps
{
    selectedFriendsIds: number[];
    removeFriendsText: string;
    removeSelectedFriends: () => void;
    onCloseClick: () => void;
}

export const FriendsRemoveConfirmationView: FC<FriendsRemoveConfirmationViewProps> = props =>
{
    const { selectedFriendsIds = null, removeFriendsText = null, removeSelectedFriends = null, onCloseClick = null } = props;

    return (
        <NitroCardView className="nitro-friends-remove-confirmation no-resize" theme="friendlist">
            <NitroCardHeaderView hideButtonClose headerText={ LocalizeText('friendlist.removefriendconfirm.title') } onCloseClick={ onCloseClick } />
            <NitroCardContentView className="text-black">
                <Column fullHeight overflow="hidden" className="px-2 py-2 bg-white rounded">
                    <Text>{ removeFriendsText }</Text>
                </Column>
                <Flex justifyContent="between" alignItems="center">
                    <Button className="volter-bold-button" disabled={ (selectedFriendsIds.length === 0) } onClick={ removeSelectedFriends }>{ LocalizeText('generic.ok') }</Button>
                    <Button className="volter-button" onClick={ onCloseClick }>{ LocalizeText('generic.cancel') }</Button>
                </Flex>
            </NitroCardContentView>
        </NitroCardView>
    );
};
