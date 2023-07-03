import { FC, useEffect } from 'react';
import { Offer, ProductTypeEnum } from '../../../../../api';
import { LayoutFurniImageView } from '../../../../../common';
import { useCatalog } from '../../../../../hooks';

export const CatalogViewTrophiesWidgetView: FC<{}> = props =>
{
    const { currentOffer = null, roomPreviewer = null, purchaseOptions = null } = useCatalog();
    const { previewStuffData = null } = purchaseOptions;

    useEffect(() =>
    {
        if(!currentOffer || (currentOffer.pricingModel === Offer.PRICING_MODEL_BUNDLE) || !roomPreviewer) return;

        const product = currentOffer.product;
        
        if(!product) return;

    }, [ currentOffer, previewStuffData, roomPreviewer ]);

    if(!currentOffer) return null;

    return <LayoutFurniImageView productType={ ProductTypeEnum.FLOOR } productClassId={ currentOffer.product.productClassId } scale={ 1 } />
}
