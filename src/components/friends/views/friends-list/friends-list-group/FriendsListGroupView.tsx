import { FC } from 'react';
import { MessengerFriend } from '../../../../../api';
import { Grid } from '../../../../../common';
import { FriendsListGroupItemView } from './FriendsListGroupItemView';

interface FriendsListGroupViewProps
{
    list: MessengerFriend[];
    selectedFriendsIds: number[];
    selectFriend: (userId: number) => void;
}

export const FriendsListGroupView: FC<FriendsListGroupViewProps> = props =>
{
    const { list = null, selectedFriendsIds = null, selectFriend = null } = props;

    if(!list || !list.length) return null;

    return (
        <>
            <Grid columnCount={ 1 } gap={ 0 } fullHeight={ false } >
                { list.map((item, index) => <FriendsListGroupItemView key={ index } friend={ item } selected={ selectedFriendsIds && (selectedFriendsIds.indexOf(item.id) >= 0) } selectFriend={ selectFriend } />) }
            </Grid>
        </>
    );
}
