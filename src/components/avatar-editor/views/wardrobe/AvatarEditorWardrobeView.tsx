import { IAvatarFigureContainer, SaveWardrobeOutfitMessageComposer } from '@nitrots/nitro-renderer';
import { Dispatch, FC, SetStateAction, useCallback, useMemo } from 'react';
import { GetAvatarRenderManager, GetClubMemberLevel, LocalizeText, SendMessageComposer } from '../../../../api';
import { AutoGrid, Base, Button, Text, Flex, LayoutAvatarImageView, LayoutCurrencyIcon, LayoutGridItem, Column } from '../../../../common';
import { LayoutWardrobeGridItem } from '../../../../common/layout/LayoutWardrobeGridItem';
import { FigureData } from '../../common/FigureData';

export interface AvatarEditorWardrobeViewProps
{
    figureData: FigureData;
    savedFigures: [ IAvatarFigureContainer, string ][];
    setSavedFigures: Dispatch<SetStateAction<[ IAvatarFigureContainer, string][]>>;
    loadAvatarInEditor: (figure: string, gender: string, reset?: boolean) => void;
}

export const AvatarEditorWardrobeView: FC<AvatarEditorWardrobeViewProps> = props =>
{
    const { figureData = null, savedFigures = [], setSavedFigures = null, loadAvatarInEditor = null } = props;

    const wearFigureAtIndex = useCallback((index: number) =>
    {
        if((index >= savedFigures.length) || (index < 0)) return;

        const [ figure, gender ] = savedFigures[index];

        loadAvatarInEditor(figure.getFigureString(), gender);
    }, [ savedFigures, loadAvatarInEditor ]);

    const saveFigureAtWardrobeIndex = useCallback((index: number) =>
    {
        if(!figureData || (index >= savedFigures.length) || (index < 0)) return;

        const newFigures = [ ...savedFigures ];

        const figure = figureData.getFigureString();
        const gender = figureData.gender;

        newFigures[index] = [ GetAvatarRenderManager().createFigureContainer(figure), gender ];

        setSavedFigures(newFigures);
        SendMessageComposer(new SaveWardrobeOutfitMessageComposer((index + 1), figure, gender));
    }, [ figureData, savedFigures, setSavedFigures ]);

    const figures = useMemo(() =>
    {
        if(!savedFigures || !savedFigures.length) return [];

        const items: JSX.Element[] = [];

        savedFigures.forEach(([ figureContainer, gender ], index) =>
        {
            let clubLevel = 0;

            if(figureContainer) clubLevel = GetAvatarRenderManager().getFigureClubLevel(figureContainer, gender);

            items.push(
                <Flex>
                        <Column gap={ 1 } className="button-container">
                        <Text onClick={ event => saveFigureAtWardrobeIndex(index) }>S</Text>
                        { figureContainer &&
                        <Text onClick={ event => wearFigureAtIndex(index) }>U</Text> }
                    </Column>
                <LayoutWardrobeGridItem key={ index } position="relative" overflow="hidden" className="nitro-avatar-editor-wardrobe-figure-preview">
                    { figureContainer &&
                    <LayoutAvatarImageView figure={ figureContainer.getFigureString() } gender={ gender } direction={ 4 } /> }
                </LayoutWardrobeGridItem>
                </Flex>
            );
        });

        return items;
    }, [ savedFigures, saveFigureAtWardrobeIndex, wearFigureAtIndex ]);

    return (
        <AutoGrid columnCount={ 5 } columnMinWidth={ 28 } columnMinHeight={ 140 }>
            { figures }
        </AutoGrid>
    );
}
