import { Dispatch, FC, SetStateAction, useCallback, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../api';
import { Text, Flex, Grid, Column } from '../../../../common';
import { CategoryData } from '../../common/CategoryData';
import { FigureData } from '../../common/FigureData';
import { IAvatarEditorCategoryModel } from '../../common/IAvatarEditorCategoryModel';
import { AvatarEditorIcon } from '../AvatarEditorIcon';
import { AvatarEditorFigureSetView } from '../figure-set/AvatarEditorFigureSetView';
import { AvatarEditorPaletteSetView } from '../palette-set/AvatarEditorPaletteSetView';
export interface AvatarEditorModelViewProps
{
    model: IAvatarEditorCategoryModel;
    gender: string;
    setGender: Dispatch<SetStateAction<string>>;
}

export const AvatarEditorModelView: FC<AvatarEditorModelViewProps> = props =>
{
    const { model = null, gender = null, setGender = null } = props;
    const [ activeCategory, setActiveCategory ] = useState<CategoryData>(null);
    const [ maxPaletteCount, setMaxPaletteCount ] = useState(1);

    const selectCategory = useCallback((name: string) =>
    {
        const category = model.categories.get(name);

        if(!category) return;

        category.init();

        setActiveCategory(category);

        for(const part of category.parts)
        {
            if(!part || !part.isSelected) continue;

            setMaxPaletteCount(part.maxColorIndex || 1);

            break;
        }
    }, [ model ]);

    useEffect(() =>
    {
        model.init();

        for(const name of model.categories.keys())
        {
            selectCategory(name);

            break;
        }
    }, [ model, selectCategory ]);

    if(!model || !activeCategory) return null;

    return (
        <Grid>
            <Column className="choose-clothing overflow-auto">
            <Flex justifyContent="center" gap={ 4 }>
                { model.canSetGender &&
                    <>
                        <Flex center pointer className="category-item" gap={ 3 } onClick={ event => setGender(FigureData.MALE) }>
                            <AvatarEditorIcon icon="male" selected={ (gender === FigureData.MALE) } />
                            <Text bold>{ LocalizeText('avatareditor.generic.boy') }</Text>
                        </Flex>
                        <Flex center pointer className="category-item" gap={ 3 } onClick={ event => setGender(FigureData.FEMALE) }>
                            <AvatarEditorIcon icon="female" selected={ (gender === FigureData.FEMALE) } />
                            <Text bold>{ LocalizeText('avatareditor.generic.girl') }</Text>
                        </Flex>
                    </> }
                { !model.canSetGender && model.categories && (model.categories.size > 0) && Array.from(model.categories.keys()).map(name =>
                {
                    const category = model.categories.get(name);

                    return (
                        <Flex center pointer key={ name } className="category-item" onClick={ event => selectCategory(name) }>
                            <AvatarEditorIcon icon={ category.name } selected={ (activeCategory === category) } />
                        </Flex>
                    );
                }) }
            </Flex>
            <Column className="h-50" size={ 5 } overflow="hidden">
                <AvatarEditorFigureSetView model={ model } category={ activeCategory } setMaxPaletteCount={ setMaxPaletteCount } />
            </Column>
            <Column size={ 5 } overflow="hidden" className="h-50">
                { (maxPaletteCount >= 1) &&
                    <AvatarEditorPaletteSetView model={ model } category={ activeCategory } paletteSet={ activeCategory.getPalette(0) } paletteIndex={ 0 } /> }
                { (maxPaletteCount === 2) &&
                    <AvatarEditorPaletteSetView model={ model } category={ activeCategory } paletteSet={ activeCategory.getPalette(1) } paletteIndex={ 1 } /> }
            </Column>
            </Column>
        </Grid>
    );
}
