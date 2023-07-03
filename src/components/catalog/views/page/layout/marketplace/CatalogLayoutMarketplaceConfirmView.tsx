import { BuyMarketplaceOfferMessageComposer } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { GetImageIconUrlForProduct, LocalizeText, MarketplaceOfferData, ProductTypeEnum, SendMessageComposer } from '../../../../../../api';
import { Base, Button, Column, Flex, LayoutLimitedEditionStyledNumberView, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../../../common';

export interface CatalogLayoutMarketplaceConfirmViewProps
{
    offerData: MarketplaceOfferData;
    setOfferData(offerData: MarketplaceOfferData): void;
}

export const CatalogLayoutMarketplaceConfirmView: FC<CatalogLayoutMarketplaceConfirmViewProps> = props =>
{
    const { offerData = null, setOfferData = null } = props;

    const onBuy = () =>
    {
        SendMessageComposer(new BuyMarketplaceOfferMessageComposer(offerData.offerId));
        setOfferData(null);
    }

    if (!offerData) return null;

    return (
        <NitroCardView className="nitro-catalog-layout-marketplace-confirm no-resize" theme="primary">
            <NitroCardHeaderView headerText={ LocalizeText('catalog.marketplace.confirm_title') } onCloseClick={ event => setOfferData(null) } />
            <NitroCardContentView overflow="hidden">
                <Column className="px-2 py-2">
                    <Flex>
                        <Flex className="image-preview">
                            <Base fit className="unique-bg-override" style={ { backgroundImage: `url(${ GetImageIconUrlForProduct(((offerData.furniType === MarketplaceOfferData.TYPE_FLOOR) ? ProductTypeEnum.FLOOR : ProductTypeEnum.WALL), offerData.furniId, offerData.extraData) })`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center' } } />
                            { (offerData.isUniqueLimitedItem ? offerData.stuffData.uniqueNumber : 0) > 0 &&
                                <div className="position-absolute bottom-0 unique-item-counter">
                                    <LayoutLimitedEditionStyledNumberView value={ offerData.isUniqueLimitedItem ? offerData.stuffData.uniqueNumber : 0 } />
                                </div>
                            }
                        </Flex>
                        <Text bold className="mt-3 px-3">{ LocalizeText(((offerData.furniType === 2) ? 'wallItem' : 'roomItem') + `.name.${ offerData.furniId }`) }</Text>
                    </Flex>
                    <Text className="font-italic">{ LocalizeText('catalog.marketplace.confirm_header') }</Text>
                    <Text className="font-size-marketplace-small mt-2">{ LocalizeText('catalog.marketplace.confirm_price', [ 'price' ], [ offerData.price.toString() ]) }</Text>
                    <Text className="font-size-marketplace-small">{ LocalizeText('catalog.marketplace.offer_details.average_price', [ 'days', 'average' ], [ '7', offerData.averagePrice.toString() ]) }</Text>
                    <Text className="font-size-marketplace-small">{ LocalizeText('catalog.marketplace.offer_details.offer_count', [ 'count' ], [ offerData.offerCount.toString() ]) }</Text>
                    <Flex justifyContent="between">
                        <Button className="w-30" onClick={ onBuy }>{ LocalizeText('buy') }</Button>
                        <Button className="w-30" onClick={ () => setOfferData(null) }>{ LocalizeText('generic.cancel') }</Button>
                    </Flex>
                </Column>
            </NitroCardContentView>
        </NitroCardView>
    );
}
