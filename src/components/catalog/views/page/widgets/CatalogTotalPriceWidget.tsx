import { FC } from 'react';
import { ColumnProps, Flex } from '../../../../../common';
import { useCatalog } from '../../../../../hooks';
import { CatalogPriceDisplayWidgetView } from './CatalogPriceDisplayWidgetView';

interface CatalogSimplePriceWidgetViewProps extends ColumnProps
{

}
export const CatalogTotalPriceWidget: FC<CatalogSimplePriceWidgetViewProps> = props =>
{
    const { gap = 1, ...rest } = props;
    const { currentOffer = null } = useCatalog();

    return (
        <Flex gap={ gap } { ...rest }>
            <CatalogPriceDisplayWidgetView separator offer={ currentOffer } />
        </Flex>
    );
}
