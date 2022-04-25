import { FC, useEffect, useState } from 'react';
import { Column, Flex, Grid, Text } from '../../../../../common';
import { useCatalog } from '../../../../../hooks';
import { CatalogItemGridWidgetView } from '../widgets/CatalogItemGridWidgetView';
import { CatalogPurchaseWidgetView } from '../widgets/CatalogPurchaseWidgetView';
import { CatalogTotalPriceWidget } from '../widgets/CatalogTotalPriceWidget';
import { CatalogViewProductWidgetView } from '../widgets/CatalogViewProductWidgetView';
import { CatalogLayoutProps } from './CatalogLayout.types';

export const CatalogLayoutTrophiesView: FC<CatalogLayoutProps> = props =>
{
    const { page = null } = props;
    const [ trophyText, setTrophyText ] = useState<string>('');
    const { currentOffer = null, setPurchaseOptions = null } = useCatalog();

    useEffect(() =>
    {
        if(!currentOffer) return;

        setPurchaseOptions(prevValue =>
        {
            const newValue = { ...prevValue };

            newValue.extraData = trophyText;

            return newValue;
        });
    }, [ currentOffer, trophyText, setPurchaseOptions ]);

    return (
        <Column>
            <Column className="pt-2" center={ !currentOffer } overflow="hidden">
                    <>
                        { !!page.localization.getImage(1) && <img alt="" src={ page.localization.getImage(1) } /> }
                        <Text small center dangerouslySetInnerHTML={ { __html: page.localization.getText(0) } } />
                    </> 
            </Column>
            <Column size={ 7 } overflow="hidden">
                <Column className="grid-bg item-picker p-2" size={ 7 } overflow="hidden">
                <CatalogItemGridWidgetView />
                </Column>
                { currentOffer &&
            <>
                <Column grow gap={ 1 }>
                    <Text grow center truncate>{ currentOffer.localizationName }</Text>
                    <Flex justifyContent="end">
                        <CatalogTotalPriceWidget alignItems="end" className="credits-bg py-1 px-2" />
                    </Flex>
                    <Flex gap={ 2 } className="purchase-buttons align-items-end mt-2">
                    <CatalogPurchaseWidgetView />
                    </Flex>
                </Column>
            </> }
                <textarea className="flex-grow-1 form-control w-100 trophy-text" defaultValue={ trophyText || '' } onChange={ event => setTrophyText(event.target.value) } />
            </Column>
        </Column>
    );
}
