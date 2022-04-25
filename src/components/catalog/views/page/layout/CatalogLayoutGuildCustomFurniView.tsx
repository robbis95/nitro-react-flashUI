import { FC } from 'react';
import { Base, Column, Flex, Grid, Text } from '../../../../../common';
import { useCatalog } from '../../../../../hooks';
import { CatalogGuildBadgeWidgetView } from '../widgets/CatalogGuildBadgeWidgetView';
import { CatalogGuildSelectorWidgetView } from '../widgets/CatalogGuildSelectorWidgetView';
import { CatalogItemGridWidgetView } from '../widgets/CatalogItemGridWidgetView';
import { CatalogPurchaseWidgetView } from '../widgets/CatalogPurchaseWidgetView';
import { CatalogTotalPriceWidget } from '../widgets/CatalogTotalPriceWidget';
import { CatalogViewProductWidgetView } from '../widgets/CatalogViewProductWidgetView';
import { CatalogLayoutProps } from './CatalogLayout.types';

export const CatalogLayouGuildCustomFurniView: FC<CatalogLayoutProps> = props =>
{
    const { page = null } = props;
    const { currentOffer = null } = useCatalog();
    
    return (
        <Column>
            <Column className="position-relative" center={ !currentOffer } size={ 5 } overflow="hidden">
                { !currentOffer &&
                    <>
                        { !!page.localization.getImage(1) && <img alt="" src={ page.localization.getImage(1) } /> }
                        <Text className="py-5" center dangerouslySetInnerHTML={ { __html: page.localization.getText(0) } } />
                    </> }
                { currentOffer &&
                    <>
                        <Base position="relative" overflow="hidden">
                            <CatalogViewProductWidgetView />
                            <CatalogGuildBadgeWidgetView position="absolute" className="top-1 end-1" />
                            <CatalogTotalPriceWidget className="credits-default-layout credits-bg py-1 px-2 bottom-1 end-1" justifyContent="end" alignItems="end" />
                        </Base>
                        <Column grow gap={ 1 }>
                            <Text bold variant="white" className="item-title" grow truncate>{ currentOffer.localizationName }</Text>
                            <Flex justifyContent="between">

                            </Flex>
                        </Column>
                        <Base grow>
                            <CatalogGuildSelectorWidgetView />
                        </Base>
                    </> }
            </Column>
            <Column className="grid-bg group-furni-picker p-2" size={ 7 } overflow="hidden">
                <CatalogItemGridWidgetView />
            </Column>
            <Flex gap={ 2 } className="purchase-buttons align-items-end mt-2">
                <CatalogPurchaseWidgetView />
            </Flex>
        </Column>
    );
}
