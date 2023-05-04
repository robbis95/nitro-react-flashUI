import { IAvatarFigureContainer, SaveWardrobeOutfitMessageComposer } from '@nitrots/nitro-renderer';
import { Dispatch, FC, SetStateAction, useCallback, useMemo } from 'react';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/all';
import { FigureData, GetAvatarRenderManager, GetClubMemberLevel, GetConfiguration, SendMessageComposer } from '../../../api';
import { Flex, LayoutAvatarImageView, LayoutCurrencyIcon } from '../../../common';
import { Border } from '../../../custom/components/layout';
import { VolterColours } from '../../../custom/common';

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

    const hcDisabled = GetConfiguration<boolean>('hc.disabled', false);

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
                <Flex key={ index } alignItems={ 'center' } justifyContent={ 'center' }>
                    { !hcDisabled && clubLevel > 0 && (
                        <LayoutCurrencyIcon className="position-absolute top-1 start-1" type="hc" />
                    ) }
                    <Flex gap={ 1 } column={ true } className="button-container">
                        <button className="saved-outfit-button" onClick={ event => saveFigureAtWardrobeIndex(index) }>
                            <MdKeyboardArrowRight />
                        </button>
                        { figureContainer && (
                            <button
                                className="saved-outfit-button"
                                onClick={ event => wearFigureAtIndex(index) }
                                disabled={ clubLevel > GetClubMemberLevel() }
                            >
                                <MdKeyboardArrowLeft />
                            </button>
                        ) }
                    </Flex>
                    <div className="avatar-container">
                        { figureContainer && (
                            <LayoutAvatarImageView className="avatar-figure" figure={ figureContainer.getFigureString() } gender={ gender } direction={ 4 } />
                        ) }
                    </div>
                </Flex>
            );
        });

        return items;
    }, [ savedFigures, hcDisabled, saveFigureAtWardrobeIndex, wearFigureAtIndex ]);

    return (
        <Border colour={ VolterColours.light_grey } className="saved-outfit-container">
            <div className="nitro-avatar-editor-wardrobe-container">
                { figures }
            </div>
        </Border>

    );
}
