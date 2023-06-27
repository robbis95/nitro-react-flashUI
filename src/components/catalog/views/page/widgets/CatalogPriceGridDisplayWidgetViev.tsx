import { FC } from 'react';
import { IPurchasableOffer } from '../../../../../api';
import { Flex, Text } from '../../../../../common';
import { useCatalog } from '../../../../../hooks';
interface CatalogPriceGridDisplayWidgetViewProps
{
    offer: IPurchasableOffer;
    separator?: boolean;
}

export const CatalogPriceGridDisplayWidgetView: FC<CatalogPriceGridDisplayWidgetViewProps> = props =>
{
    const { offer = null, separator = false } = props;
    const { purchaseOptions = null } = useCatalog();
    const { quantity = 1 } = purchaseOptions;

    if(!offer) return null;

    return (
        <>
            { (offer.priceInCredits > 0) &&
                <Flex alignItems="end" justifyContent="end" gap={ 1 } className="grid-price-view">
                    <Text bold>{ (offer.priceInCredits * quantity) }</Text>
                    <i className="icon icon-small-coin" />
                </Flex> }
            { (offer.priceInActivityPoints > 0) &&
                <Flex alignItems="end" justifyContent="end" gap={ 1 } className="grid-price-view">
                    { separator && (offer.priceInCredits > 0) && (offer.priceInActivityPoints > 0) && <Text bold>+</Text> }
                    <Text bold>{ (offer.priceInActivityPoints * quantity) }</Text>
                    <i className={ 'icon icon-small-' + offer.activityPointType } />
                </Flex> }
        </>
    );
}
