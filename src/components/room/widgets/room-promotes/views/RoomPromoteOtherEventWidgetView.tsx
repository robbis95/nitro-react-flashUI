import { FC } from 'react';
import { LocalizeText } from '../../../../../api';
import { Flex, Text } from '../../../../../common';

interface RoomPromoteOtherEventWidgetViewProps
{
    eventDescription: string;
}

export const RoomPromoteOtherEventWidgetView: FC<RoomPromoteOtherEventWidgetViewProps> = props =>
{
    const { eventDescription = '' } = props;

    return (
        <>
            <Flex className="px-2 py-2" alignItems="center" gap={ 2 } style={ { overflowWrap: 'anywhere', overflow: 'hidden', height: '60px' } }>
                <Text variant="white" dangerouslySetInnerHTML={ { __html: eventDescription.replace(/\n/g,'<br />') } } />
            </Flex>
            <Flex className="bg-light-dark rounded mt-4">
                <Flex fit center>
                    <Text variant="white" center>{ LocalizeText('navigator.eventinprogress') }</Text>
                </Flex>
            </Flex>
        </>
    );
};
