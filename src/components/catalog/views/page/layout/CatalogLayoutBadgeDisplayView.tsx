import { FC } from 'react';
import { LocalizeText, getTypePrice } from '../../../../../api';
import { Base, Column, Flex, Grid, Text } from '../../../../../common';
import { useCatalog } from '../../../../../hooks';
import { CatalogBadgeSelectorWidgetView } from '../widgets/CatalogBadgeSelectorWidgetView';
import { CatalogFirstProductSelectorWidgetView } from '../widgets/CatalogFirstProductSelectorWidgetView';
import { CatalogItemGridWidgetView } from '../widgets/CatalogItemGridWidgetView';
import { CatalogLimitedItemWidgetView } from '../widgets/CatalogLimitedItemWidgetView';
import { CatalogPurchaseWidgetView } from '../widgets/CatalogPurchaseWidgetView';
import { CatalogTotalPriceWidget } from '../widgets/CatalogTotalPriceWidget';
import { CatalogViewProductWidgetView } from '../widgets/CatalogViewProductWidgetView';
import { CatalogLayoutProps } from './CatalogLayout.types';

export const CatalogLayoutBadgeDisplayView: FC<CatalogLayoutProps> = props =>
{
    const { page = null } = props;
    const { currentOffer = null } = useCatalog();

    return (
        <>
            <CatalogFirstProductSelectorWidgetView />
            <Grid>
                <Column center={ !currentOffer } size={ 12 }>
                    { !currentOffer &&
                        <>
                            { !!page.localization.getImage(1) && <img alt="" src={ page.localization.getImage(1) } /> }
                            <Text center dangerouslySetInnerHTML={ { __html: page.localization.getText(0) } } />
                        </> 
                    }
                    { currentOffer &&
                        <>
                            <Base position="relative" overflow="hidden">
                                <CatalogViewProductWidgetView />
                                <CatalogTotalPriceWidget className={ `credits-default-layout ${ getTypePrice(currentOffer.priceType) } py-1 px-2 bottom-2 end-2` } justifyContent="end" alignItems="end" />
                                <Text bold variant="white" className="item-title" grow truncate>{ currentOffer.localizationName }</Text>
                            </Base>
                            <Column grow gap={ 1 }>
                                <CatalogLimitedItemWidgetView fullWidth />
                            </Column>
                        </>
                    }
                </Column>
                <Column size={ 6 } overflow="auto" className="grid-bg p-2">
                    <Column overflow="auto">
                        <CatalogItemGridWidgetView shrink />
                    </Column>
                    <Text className="selectproduct-title bottom-5">
                        { LocalizeText('catalog_selectproduct') }
                    </Text>
                </Column>
                <Column size={ 6 } overflow="hidden">
                    <Column gap={ 1 } overflow="hidden">
                        <CatalogBadgeSelectorWidgetView />
                    </Column>
                </Column>
                <Column size={ 12 } overflow="hidden">
                    <Flex gap={ 2 } className="purchase-buttons align-items-end mt-2">
                        <CatalogPurchaseWidgetView />
                    </Flex>
                </Column>
            </Grid>
        </>
    );
}
