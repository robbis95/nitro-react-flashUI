import { FC } from 'react';
import { LocalizeText } from '../../../../../api';
import { Button, Column, Flex, NitroCardAccordionSetViewProps } from '../../../../../common';
import { useFriends } from '../../../../../hooks';
import { FriendsListRequestItemView } from './FriendsListRequestItemView';

export const FriendsListRequestView: FC<NitroCardAccordionSetViewProps> = props =>
{
    const { children = null, ...rest } = props;
    const { requests = [], requestResponse = null } = useFriends();

    if(!requests.length) return (
        <>
            <Column fullHeight justifyContent="center" alignItems="center" gap={ 1 }>
                <Column gap={ 0 }>
                    <strong>Du har ingen venneforespørsler</strong>
                </Column>
            </Column>
        </>
    );

    return (
        <>
            <Column fullHeight justifyContent="between" gap={ 1 }>
                <Column gap={ 0 }>
                    { requests.map((request, index) => <FriendsListRequestItemView key={ index } request={ request } />) }
                </Column>
                <Flex justifyContent="center" className="px-2 py-1">
                    <Button onClick={ event => requestResponse(-1, false) }>
                        { LocalizeText('friendlist.requests.dismissall') }
                    </Button>
                </Flex>
            </Column>
            { children }
        </>
    );
}
