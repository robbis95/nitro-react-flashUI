import { FC } from 'react';
import { Column } from '../../../../../common/Column';
import { Grid } from '../../../../../common/Grid';
import { Text } from '../../../../../common/Text';
import { CatalogAddOnBadgeWidgetView } from '../widgets/CatalogAddOnBadgeWidgetView';
import { CatalogBundleGridWidgetView } from '../widgets/CatalogBundleGridWidgetView';
import { CatalogFirstProductSelectorWidgetView } from '../widgets/CatalogFirstProductSelectorWidgetView';
import { CatalogPurchaseWidgetView } from '../widgets/CatalogPurchaseWidgetView';
import { CatalogSimplePriceWidgetView } from '../widgets/CatalogSimplePriceWidgetView';
import { CatalogLayoutProps } from './CatalogLayout.types';

export const CatalogLayoutSingleBundleView: FC<CatalogLayoutProps> = props =>
{
    const { page = null } = props;

    return (
        <>
            <CatalogFirstProductSelectorWidgetView />
            <Column>
            { !!page.localization.getText(1) &&
                        <Text center small overflow="auto">{ page.localization.getText(1) }</Text> }
            </Column>
            <Grid>
                <Column size={ 5 } overflow="hidden" gap={ 1 }>
                    <Column grow position="relative" overflow="hidden" gap={ 0 }>
                        { !!page.localization.getImage(1) &&
                            <img alt="" className="flex-grow-1" src={ page.localization.getImage(1) } /> }
                        <CatalogAddOnBadgeWidgetView position="absolute" className="bg-muted rounded bottom-0 start-0" />
                        <CatalogSimplePriceWidgetView position="absolute" className="bottom-0 end-0" />
                    </Column>
                    <Column gap={ 1 }>
                        <CatalogPurchaseWidgetView />
                    </Column>
                </Column>
                <Column size={ 7 } overflow="hidden">
                    { !!page.localization.getText(2) &&
                        <Text dangerouslySetInnerHTML={ { __html: page.localization.getText(2) } } /> }
                    <Column grow overflow="hidden" className="grid-bg p-2">
                        <CatalogBundleGridWidgetView fullWidth className="nitro-catalog-layout-bundle-grid" />
                    </Column>
                </Column>
            </Grid>
        </>
    );
}
