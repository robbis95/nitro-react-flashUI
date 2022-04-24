import { HighScoreDataType, ObjectDataFactory, RoomEngineTriggerWidgetEvent, RoomObjectCategory, RoomObjectVariable } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { GetRoomEngine, LocalizeText } from '../../../../../api';
import { Column, Flex, Text } from '../../../../../common';
import { UseRoomEngineEvent } from '../../../../../hooks';
import { useRoomContext } from '../../../RoomContext';
import { ContextMenuHeaderView } from '../../context-menu/ContextMenuHeaderView';
import { ContextMenuListView } from '../../context-menu/ContextMenuListView';
import { ObjectLocationView } from '../../object-location/ObjectLocationView';

const SCORE_TYPES = [ 'perteam', 'mostwins', 'classic' ];
const CLEAR_TYPES = [ 'alltime', 'daily', 'weekly', 'monthly' ];

export const FurnitureHighScoreView: FC<{}> = props =>
{
    const [ stuffDatas, setStuffDatas ] = useState<Map<number, HighScoreDataType>>(new Map());
    const { roomSession = null } = useRoomContext();

    const onRoomEngineTriggerWidgetEvent = useCallback((event: RoomEngineTriggerWidgetEvent) =>
    {
        switch(event.type)
        {
            case RoomEngineTriggerWidgetEvent.REQUEST_HIGH_SCORE_DISPLAY: {
                const object = GetRoomEngine().getRoomObject(roomSession.roomId, event.objectId, event.category);

                if(!object) return;

                const formatKey = object.model.getValue<number>(RoomObjectVariable.FURNITURE_DATA_FORMAT);
                const stuffData = (ObjectDataFactory.getData(formatKey) as HighScoreDataType);

                stuffData.initializeFromRoomObjectModel(object.model);

                setStuffDatas(prevValue =>
                {
                    const newValue = new Map(prevValue);

                    newValue.set(object.id, stuffData);

                    return newValue;
                });
                return;
            }
            case RoomEngineTriggerWidgetEvent.REQUEST_HIDE_HIGH_SCORE_DISPLAY:
                if(event.roomId !== roomSession.roomId) return;

                setStuffDatas(prevValue =>
                {
                    const newValue = new Map(prevValue);

                    newValue.delete(event.objectId);

                    return newValue;
                });
                return;
        }
    }, [ roomSession ]);

    UseRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_HIGH_SCORE_DISPLAY, onRoomEngineTriggerWidgetEvent);
    UseRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_HIDE_HIGH_SCORE_DISPLAY, onRoomEngineTriggerWidgetEvent);

    if(!stuffDatas.size) return null;

    return (
        <>
            { Array.from(stuffDatas.entries()).map(([ objectId, stuffData ], index) =>
            {
                return (
                    <ObjectLocationView key={ index } objectId={ objectId } category={ RoomObjectCategory.FLOOR }>
                        <Column className="nitro-widget-high-score" gap={ 0 }>
                            <Flex center className="nitro-widget-high-score-header">
                                <Text small bold>{ LocalizeText('high.score.display.caption', [ 'scoretype', 'cleartype' ], [ LocalizeText(`high.score.display.scoretype.${ SCORE_TYPES[stuffData.scoreType] }`), LocalizeText(`high.score.display.cleartype.${ CLEAR_TYPES[stuffData.clearType] }`) ]) }</Text>
                            </Flex>
                            <Column overflow="hidden" gap={ 1 } className="h-100">
                                <Column gap={ 1 }>
                                    <Flex alignItems="center" className="score-board-header mt-1 p-1">
                                        <Text small variant="black" className="col-8">
                                            { LocalizeText('high.score.display.users.header') }
                                        </Text>
                                        <Text small variant="black" className="col-4">
                                            { LocalizeText('high.score.display.score.header') }
                                        </Text>
                                    </Flex>
                                    <hr className="m-0" />
                                </Column>
                                <Column overflow="auto" gap={ 1 } className="overflow-y-auto high-score-results p-2">
                                    { stuffData.entries.map((entry, index) =>
                                    {
                                        return (
                                            <Flex key={ index } alignItems="center">
                                                <Text small variant="white" className="col-8">
                                                    { entry.users.join(', ') }
                                                </Text>
                                                <Text small center variant="white" className="col-4">
                                                    { entry.score }
                                                </Text>
                                            </Flex>
                                        );
                                    }) }
                                </Column>
                                <i className="trophy position-absolute"/>
                                <Flex center className="bottom-text">
                                    <Text small center>{LocalizeText('high.score.display.congratulations.footer')}</Text>
                                </Flex>
                            </Column>
                        </Column>
                    </ObjectLocationView>
                );
            }) }
        </>
    );
}
