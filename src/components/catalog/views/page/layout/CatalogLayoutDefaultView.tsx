import { FC } from 'react';
import { Base, Column, Flex, Grid, Text } from '../../../../../common';
import { useCatalogContext } from '../../../CatalogContext';
import { CatalogAddOnBadgeWidgetView } from '../widgets/CatalogAddOnBadgeWidgetView';
import { CatalogItemGridWidgetView } from '../widgets/CatalogItemGridWidgetView';
import { CatalogLimitedItemWidgetView } from '../widgets/CatalogLimitedItemWidgetView';
import { CatalogPurchaseWidgetView } from '../widgets/CatalogPurchaseWidgetView';
import { CatalogSpinnerWidgetView } from '../widgets/CatalogSpinnerWidgetView';
import { CatalogTotalPriceWidget } from '../widgets/CatalogTotalPriceWidget';
import { CatalogViewProductWidgetView } from '../widgets/CatalogViewProductWidgetView';
import { CatalogLayoutProps } from './CatalogLayout.types';

export const CatalogLayoutDefaultView: FC<CatalogLayoutProps> = props =>
{
    const { page = null } = props;
    const { currentOffer = null } = useCatalogContext();

    return (
        <div>
            <Column className="position-relative" center={ !currentOffer } size={ 5 } overflow="hidden">
                { !currentOffer &&
                    <>
                        { !!page.localization.getImage(1) && <img className="catalog-image-column" alt="" src={ page.localization.getImage(1) } /> }
                    </> }
                { currentOffer &&
                    <>
                        <Base position="relative" overflow="hidden">
                            <CatalogViewProductWidgetView />
                            <CatalogLimitedItemWidgetView fullWidth position="absolute" className="top-1" />
                            <CatalogAddOnBadgeWidgetView position="absolute" className="bg-muted rounded bottom-1 end-1" />
                        </Base>
                        <Column grow gap={ 1 }>
                            <Text bold variant="white" className="item-title" grow truncate>{ currentOffer.localizationName }</Text>
                            <Flex justifyContent="between">
                                <CatalogTotalPriceWidget className="credits-default-layout credits-bg py-1 px-2" justifyContent="end" alignItems="end" />
                            </Flex>
                        </Column>
                    </> }
            </Column>
            <Column className="grid-bg item-picker p-2" size={ 7 } overflow="hidden">
                <CatalogItemGridWidgetView />
            </Column>
            <Flex gap={ 1 } className="quanity-container">
                <CatalogSpinnerWidgetView />
            </Flex>
            <Flex gap={ 2 } className="purchase-buttons align-items-end mt-3">
            <CatalogPurchaseWidgetView />
            </Flex>

        </div>
    );
}
