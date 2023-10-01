import { FC } from 'react';
import { IPurchasableOffer } from '../../../../../api';
import { Base, Flex, LayoutCurrencyIcon, Text } from '../../../../../common';
import { useCatalog } from '../../../../../hooks';

interface CatalogPriceDisplayWidgetViewProps
{
    offer: IPurchasableOffer;
    separator?: boolean;
}

export const CatalogPriceDisplayWidgetView: FC<CatalogPriceDisplayWidgetViewProps> = props =>
{
    const { offer = null, separator = false } = props;
    const { purchaseOptions = null } = useCatalog();
    const { quantity = 1 } = purchaseOptions;

    if(!offer) return null;

    return (
        <>
            { (offer.priceInCredits > 0) &&
                <Flex alignItems="center" gap={ 1 }>
                    <Text bold>{ (offer.priceInCredits * quantity) }</Text>
                    <Base className="icon icon-credits" />
                </Flex> }
            { separator && (offer.priceInCredits > 0) && (offer.priceInActivityPoints > 0) &&
                <Text bold>+</Text> }
            { (offer.priceInActivityPoints > 0) &&
                <Flex alignItems="center" gap={ 1 }>
                    <Text bold> { (offer.priceInActivityPoints * quantity) }</Text>
                    <LayoutCurrencyIcon type={ offer.activityPointType } />
                </Flex> }
        </>
    );
}
