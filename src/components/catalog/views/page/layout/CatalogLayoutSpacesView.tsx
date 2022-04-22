import { NitroPoint } from '@nitrots/nitro-renderer';
import { FC, useEffect } from 'react';
import { Base } from '../../../../../common/Base';
import { Column } from '../../../../../common/Column';
import { Flex } from '../../../../../common/Flex';
import { Grid } from '../../../../../common/Grid';
import { Text } from '../../../../../common/Text';
import { useCatalogContext } from '../../../CatalogContext';
import { CatalogPurchaseWidgetView } from '../widgets/CatalogPurchaseWidgetView';
import { CatalogSpacesWidgetView } from '../widgets/CatalogSpacesWidgetView';
import { CatalogTotalPriceWidget } from '../widgets/CatalogTotalPriceWidget';
import { CatalogViewProductWidgetView } from '../widgets/CatalogViewProductWidgetView';
import { CatalogLayoutProps } from './CatalogLayout.types';

export const CatalogLayoutSpacesView: FC<CatalogLayoutProps> = props =>
{
    const { page = null } = props;
    const { currentOffer = null, roomPreviewer = null } = useCatalogContext();

    useEffect(() =>
    {
        roomPreviewer.updatePreviewObjectBoundingRectangle(new NitroPoint());
    }, [ roomPreviewer ]);

    return (
        <Column>
            <Column size={ 7 } overflow="hidden">
                <CatalogSpacesWidgetView />
            </Column>
            <Column center={ !currentOffer } size={ 5 } overflow="hidden">
                { !currentOffer &&
                    <>
                        { !!page.localization.getImage(1) && <img alt="" src={ page.localization.getImage(1) } /> }
                        <Text center dangerouslySetInnerHTML={ { __html: page.localization.getText(0) } } />
                    </> }
                { currentOffer &&
                    <>
                        <Base position="relative" overflow="hidden">
                            <CatalogViewProductWidgetView />
                            <CatalogTotalPriceWidget className="credits-default-layout credits-bg py-1 px-2 bottom-1 end-1" justifyContent="end" alignItems="end" />
                            <Text bold variant="white" className="item-title" grow truncate>{ currentOffer.localizationName }</Text>
                        </Base>
                        <Flex gap={ 2 } className="purchase-buttons align-items-end mt-2">
                            <CatalogPurchaseWidgetView />
                        </Flex>
                    </> }
            </Column>
        </Column>
    );
}
