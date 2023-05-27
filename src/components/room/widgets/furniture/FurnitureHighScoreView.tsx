import { RoomObjectCategory } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { LocalizeText } from '../../../../api';
import { Column, Flex, Text } from '../../../../common';
import { useFurnitureHighScoreWidget } from '../../../../hooks';
import { ContextMenuHeaderView } from '../context-menu/ContextMenuHeaderView';
import { ContextMenuListView } from '../context-menu/ContextMenuListView';
import { ObjectLocationView } from '../object-location/ObjectLocationView';

export const FurnitureHighScoreView: FC<{}> = props =>
{
    const { stuffDatas = null, getScoreType = null, getClearType = null } = useFurnitureHighScoreWidget();

    if(!stuffDatas || !stuffDatas.size) return null;

    return (
        <>
            { Array.from(stuffDatas.entries()).map(([ objectId, stuffData ], index) =>
            {
                return (
                    <ObjectLocationView key={ index } objectId={ objectId } category={ RoomObjectCategory.FLOOR }>
                        <div className="high-score-wired">
                            <Column className="nitro-widget-high-score nitro-context-menu" gap={ 0 }>
                                <ContextMenuHeaderView className="header">
                                    <Flex alignItems="center" className="mt-1">
                                        { LocalizeText('high.score.display.caption', [ 'scoretype', 'cleartype' ], [ LocalizeText(`high.score.display.scoretype.${ getScoreType(stuffData.scoreType) }`), LocalizeText(`high.score.display.cleartype.${ getClearType(stuffData.clearType) }`) ]) }
                                    </Flex>
                                </ContextMenuHeaderView>
                                <ContextMenuListView overflow="hidden" gap={ 1 } className="h-100 mt-2">
                                    <Column gap={ 1 }>
                                        <Flex alignItems="center">
                                            <Text variant="black" className="col-8 section-border rounded p-1">
                                                { LocalizeText('high.score.display.users.header') }
                                            </Text>
                                            <Text variant="black" className="col-4 align-right section-border rounded p-1">
                                                { LocalizeText('high.score.display.score.header') }
                                            </Text>
                                        </Flex>
                                    </Column>
                                    <Column overflow="auto" gap={ 1 } className="overflow-y-scroll high-score-content">
                                        { stuffData.entries.map((entry, index) =>
                                        {
                                            return (
                                                <Flex key={ index } alignItems="center">
                                                    <Text center className="col-8 score-color">
                                                        { entry.users.join(', ') }
                                                    </Text>
                                                    <Text center className="col-4 score-color">
                                                        { entry.score }
                                                    </Text>
                                                </Flex>
                                            );
                                        }) }
                                    </Column>
                                    <Text center className="score-footer mb-1">
                                        { LocalizeText('high.score.display.congratulations.footer') }
                                    </Text>
                                </ContextMenuListView>
                            </Column>
                        </div>
                    </ObjectLocationView>
                );
            }) }
        </>
    );
}
