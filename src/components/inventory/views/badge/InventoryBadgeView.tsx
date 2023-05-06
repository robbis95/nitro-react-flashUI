import { FC, useEffect, useState } from 'react';
import { LocalizeBadgeName, LocalizeText, UnseenItemCategory } from '../../../../api';
import { AutoGrid, Button, Column, Flex, Grid, LayoutBadgeImageView, Text } from '../../../../common';
import { useAchievements, useInventoryBadges, useInventoryUnseenTracker } from '../../../../hooks';
import { InventoryBadgeItemView } from './InventoryBadgeItemView';

export const InventoryBadgeView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const { badgeCodes = [], activeBadgeCodes = [], selectedBadgeCode = null, isWearingBadge = null, canWearBadges = null, toggleBadge = null, getBadgeId = null, activate = null, deactivate = null } = useInventoryBadges();
    const { isUnseen = null, removeUnseen = null } = useInventoryUnseenTracker();
    const { achievementScore = 0 } = useAchievements();
    const [ searchValue, setSearchValue ] = useState('');

    let search = searchValue?.toLocaleLowerCase().replace(' ', '');

    const filterBadgeCodes = () =>
    {
        return badgeCodes.filter((badgeCode) =>
        {
            return LocalizeBadgeName(badgeCode).toLocaleLowerCase().includes(search);
        });
    };


    const filteredBadgeCodes = filterBadgeCodes();

    useEffect(() =>
    {
        if(!selectedBadgeCode || !isUnseen(UnseenItemCategory.BADGE, getBadgeId(selectedBadgeCode))) return;

        removeUnseen(UnseenItemCategory.BADGE, getBadgeId(selectedBadgeCode));
    }, [ selectedBadgeCode, isUnseen, removeUnseen, getBadgeId ]);

    useEffect(() =>
    {
        if(!isVisible) return;

        const id = activate();

        return () => deactivate(id);
    }, [ isVisible, activate, deactivate ]);

    useEffect(() =>
    {
        setIsVisible(true);

        return () => setIsVisible(false);
    }, []);

    return (
        <div>
            <Grid gap={ 2 } className="badges-list">
                <Column size={ 8 } overflow="hidden">
                    <Flex gap={ 1 } className="position-relative">
                        <Flex fullWidth alignItems="center" position="relative">
                            <input type="text" className="form-control form-control-sm" placeholder={ LocalizeText('generic.search') } value={ searchValue } onChange={ event => setSearchValue(event.target.value) } />
                        </Flex>
                    </Flex>
                    <AutoGrid gap={ 1 } columnCount={ 5 }>
                        { filteredBadgeCodes && filteredBadgeCodes.length > 0 && filteredBadgeCodes.map((badgeCode, index) =>
                        {
                            if (isWearingBadge(badgeCode)) return null;

                            return <InventoryBadgeItemView key={ index } badgeCode={ badgeCode } />;
                        }) }
                    </AutoGrid>
                </Column>
                <Column className="justify-content-between" size={ 4 } overflow="auto">
                    <Column overflow="hidden">
                        <Text center bold>{ LocalizeText('inventory.badges.activebadges') }</Text>
                        <AutoGrid gap={ 1 } columnCount={ 5 }>
                            { activeBadgeCodes && (activeBadgeCodes.length > 0) && activeBadgeCodes.map((badgeCode, index) => <InventoryBadgeItemView key={ index } badgeCode={ badgeCode } />) }
                        </AutoGrid>
                    </Column>
                </Column>
            </Grid>
            { !!selectedBadgeCode &&
                <Flex className="bg-white pb-1 px-2 rounded mt-2" style={ { height: '50px' } } justifyContent={ 'between' } alignItems={ 'end' } gap={ 2 }>
                    <Flex alignItems="start" gap={ 2 }>
                        <LayoutBadgeImageView shrink badgeCode={ selectedBadgeCode } />
                        <Text className="font-bold mt-2">{ LocalizeBadgeName(selectedBadgeCode) }</Text>
                    </Flex>
                    <Button className="btn btn-primary mb-1" style={ { fontSize: '12px' } } disabled={ !isWearingBadge(selectedBadgeCode) && !canWearBadges() } onClick={ event => toggleBadge(selectedBadgeCode) }>{ LocalizeText(isWearingBadge(selectedBadgeCode) ? 'inventory.badges.clearbadge' : 'inventory.badges.wearbadge') }</Button>
                </Flex> }
            <div className="nitro-progress-bar text-white mt-1">
                <Text small center style={ { marginTop: '-1px' } }>{ LocalizeText('achievements.categories.score', [ 'score' ], [ achievementScore.toString() ]) }</Text>
            </div>
        </div>
    );
}
