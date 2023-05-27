import { FC } from 'react';
import { CreateLinkEvent, LocalizeText } from '../../../../../api';
import { Flex, Text } from '../../../../../common';
import { useRoomPromote } from '../../../../../hooks';

interface RoomPromoteMyOwnEventWidgetViewProps
{
    eventDescription: string;
    setIsEditingPromote: (value: boolean) => void;
}

export const RoomPromoteMyOwnEventWidgetView: FC<RoomPromoteMyOwnEventWidgetViewProps> = props =>
{
    const { eventDescription = '', setIsEditingPromote = null } = props;
    const { setIsExtended } = useRoomPromote();

    const extendPromote = () =>
    {
        setIsExtended(true);
        CreateLinkEvent('catalog/open/room_event');
    }

    return (
        <>
            <Flex className="px-2 py-2" alignItems="center" gap={ 2 } style={ { overflowWrap: 'anywhere', overflow: 'hidden', height: '60px' } }>
                <Text variant="white" dangerouslySetInnerHTML={ { __html: eventDescription.replace(/\n/g,'<br />') } } />
            </Flex>
            <Flex className="mb-1" alignItems="center" justifyContent="around">
                <Text pointer underline onClick={ event => setIsEditingPromote(true) }>{ LocalizeText('navigator.roominfo.editevent') }</Text>
                <Text pointer underline onClick={ event => extendPromote() }>{ LocalizeText('roomad.extend.event') }</Text>
            </Flex>
        </>
    );
};
