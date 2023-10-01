import { FC } from 'react';
import { IPurchasableOffer } from '../../../../../api';
import { Flex, Text } from '../../../../../common';
interface CatalogPriceGridDisplayWidgetViewProps
{
    offer: IPurchasableOffer;
    separator?: boolean;
}

export const CatalogPriceGridDisplayWidgetView: FC<CatalogPriceGridDisplayWidgetViewProps> = props =>
{
    const { offer = null, separator = false } = props;

    if(!offer) return null;

    return (
        <>
            { (offer.priceInCredits > 0) &&
                <Flex alignItems="end" justifyContent="end" gap={ 1 } className="grid-price-view">
                    <Text bold>{ (offer.priceInCredits) }</Text>
                    <i className="icon icon-small-coin" />
                </Flex>
            }
            { (offer.priceInActivityPoints > 0) &&
                <Flex alignItems="end" justifyContent="end" gap={ 1 } className="grid-price-view">
                    { separator && (offer.priceInCredits > 0) && (offer.priceInActivityPoints > 0) && <Text bold>+</Text> }
                    <Text bold>{ (offer.priceInActivityPoints) }</Text>
                    <i className={ 'icon icon-small-' + offer.activityPointType } />
                </Flex> }
        </>
    );
}
