import { GetMarketplaceConfigurationMessageComposer, MakeOfferMessageComposer, MarketplaceConfigurationEvent } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { FurnitureItem, LocalizeText, ProductTypeEnum, SendMessageComposer } from '../../../../../../api';
import { Button, Column, Flex, LayoutFurniImageView, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../../../common';
import { CatalogPostMarketplaceOfferEvent } from '../../../../../../events';
import { useCatalog, useMessageEvent, useNotification, useUiEvent } from '../../../../../../hooks';

export const MarketplacePostOfferView : FC<{}> = props =>
{
    const [ item, setItem ] = useState<FurnitureItem>(null);
    const [ askingPrice, setAskingPrice ] = useState(0);
    const [ tempAskingPrice, setTempAskingPrice ] = useState('0');
    const { catalogOptions = null, setCatalogOptions = null } = useCatalog();
    const { marketplaceConfiguration = null } = catalogOptions;
    const { showConfirm = null } = useNotification();

    const updateAskingPrice = (price: string) =>
    {
        setTempAskingPrice(Number(price) >= marketplaceConfiguration.maximumPrice ? marketplaceConfiguration.maximumPrice.toString() : price);

        const newValue = Number(price);

        if(isNaN(newValue) || (newValue === askingPrice)) return;

        setAskingPrice(Number(price));
    }

    useMessageEvent<MarketplaceConfigurationEvent>(MarketplaceConfigurationEvent, event =>
    {
        const parser = event.getParser();

        setCatalogOptions(prevValue =>
        {
            const newValue = { ...prevValue };

            newValue.marketplaceConfiguration = parser;

            return newValue;
        });
    });

    useUiEvent<CatalogPostMarketplaceOfferEvent>(CatalogPostMarketplaceOfferEvent.POST_MARKETPLACE, event => setItem(event.item));

    useEffect(() =>
    {
        if(!item || marketplaceConfiguration) return;

        SendMessageComposer(new GetMarketplaceConfigurationMessageComposer());
    }, [ item, marketplaceConfiguration ]);

    useEffect(() =>
    {
        if(!item) return;
        
        return () => setAskingPrice(0);
    }, [ item ]);

    if(!marketplaceConfiguration || !item) return null;

    const getFurniTitle = (item ? LocalizeText(item.isWallItem ? 'wallItem.name.' + item.type : 'roomItem.name.' + item.type) : '');

    const postItem = () =>
    {
        if(!item || (askingPrice < marketplaceConfiguration.minimumPrice)) return;

        showConfirm(LocalizeText('inventory.marketplace.confirm_offer.info', [ 'furniname', 'price' ], [ getFurniTitle, askingPrice.toString() ]), () =>
        {
            SendMessageComposer(new MakeOfferMessageComposer(askingPrice, item.isWallItem ? 2 : 1, item.id));
            setItem(null);
            setTempAskingPrice('');
        },
        () => 
        {
            setItem(null) 
        }, null, null, LocalizeText('inventory.marketplace.confirm_offer.title'));
    }
    
    return (
        <NitroCardView className="nitro-catalog-layout-marketplace-post-offer no-resize" theme="primary">
            <NitroCardHeaderView headerText={ LocalizeText('inventory.marketplace.make_offer.title') } onCloseClick={ event => setItem(null) } />
            <NitroCardContentView overflow="hidden">
                <Column className="px-2">
                    <Flex>
                        <Flex className="image-preview">
                            <LayoutFurniImageView productType={ item.isWallItem ? ProductTypeEnum.WALL : ProductTypeEnum.FLOOR } productClassId={ item.type } extraData={ item.extra.toString() } />
                        </Flex>
                        <Text bold className="px-2">{ getFurniTitle }</Text>
                    </Flex>
                    <Text className="font-size-marketplace">{ LocalizeText('inventory.marketplace.make_offer.expiration_info', [ 'time' ], [ marketplaceConfiguration.displayTime.toString() ] ) }</Text>
                    <Flex justifyContent="end" gap={ 2 }>
                        <Text bold>{ LocalizeText('inventory.marketplace.make_offer.price_request') }</Text>
                        <input className="form-control form-control-sm w-25" type="number" min={ 0 } value={ tempAskingPrice } onChange={ event => updateAskingPrice(event.target.value) } />
                    </Flex>
                    <Text className="font-size-marketplace">{ LocalizeText('inventory.marketplace.make_offer.average_price', [ 'days', 'price', 'price_no_commission' ], [ marketplaceConfiguration.offerTime.toString(), marketplaceConfiguration.minimumPrice.toString(), marketplaceConfiguration.commission.toString() ] ) }</Text>
                    <textarea className="form-control form-control-sm font-size-marketplace-small overflow-hidden textarea-height" value={ askingPrice >= marketplaceConfiguration.minimumPrice ? LocalizeText('sell.in.marketplace.revenue.label') + ': ' + (askingPrice - 1) : LocalizeText('shop.marketplace.invalid.price', [ 'minPrice', 'maxPrice' ], [ marketplaceConfiguration.minimumPrice.toString(), marketplaceConfiguration.maximumPrice.toString() ]) } readOnly></textarea>
                    <Flex justifyContent="between">
                        <Button className="w-30" onClick={ postItem } disabled={ ((askingPrice < marketplaceConfiguration.minimumPrice) || (askingPrice > marketplaceConfiguration.maximumPrice) || isNaN(askingPrice)) }>{ LocalizeText('inventory.marketplace.make_offer.post') }</Button>
                        <Button className="w-30" onClick={ () => setItem(null) }>{ LocalizeText('generic.cancel') }</Button>
                    </Flex>
                </Column>
            </NitroCardContentView>
        </NitroCardView>
    )
}
