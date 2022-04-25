import { ILinkEventTracker } from '@nitrots/nitro-renderer';
import { FC, useEffect } from 'react';
import { AddEventLinkTracker, LocalizeText, RemoveLinkEventTracker } from '../../api';
import { Column, Flex, Grid, NitroCardContentView, NitroCardHeaderView, NitroCardTabsItemView, NitroCardTabsView, NitroCardView, Text } from '../../common';
import { useCatalog } from '../../hooks';
import { CatalogIconView } from './views/catalog-icon/CatalogIconView';
import { CatalogGiftView } from './views/gift/CatalogGiftView';
import { CatalogNavigationView } from './views/navigation/CatalogNavigationView';
import { GetCatalogLayout } from './views/page/layout/GetCatalogLayout';
import { MarketplacePostOfferView } from './views/page/layout/marketplace/MarketplacePostOfferView';

export const CatalogView: FC<{}> = props =>
{
    const { isVisible = false, setIsVisible = null, rootNode = null, currentPage = null, navigationHidden = false, setNavigationHidden = null, activeNodes = [], searchResult = null, setSearchResult = null, openPageByName = null, openPageByOfferId = null, getNodeById = null, activateNode = null } = useCatalog();

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived: (url: string) =>
            {
                const parts = url.split('/');
        
                if(parts.length < 2) return;
        
                switch(parts[1])
                {
                    case 'show':
                        setIsVisible(true);
                        return;
                    case 'hide':
                        setIsVisible(false);
                        return;
                    case 'toggle':
                        setIsVisible(prevValue => !prevValue);
                        return;
                    case 'open':
                        if(parts.length > 2)
                        {
                            if(parts.length === 4)
                            {
                                switch(parts[2])
                                {
                                    case 'offerId':
                                        openPageByOfferId(parseInt(parts[3]));
                                        return;
                                }
                            }
                            else
                            {
                                openPageByName(parts[2]);
                            }
                        }
                        else
                        {
                            setIsVisible(true);
                        }
        
                        return;
                }
            },
            eventUrlPrefix: 'catalog/'
        };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, [ setIsVisible, openPageByOfferId, openPageByName ]);

    return (
        <>
            { isVisible &&
                <NitroCardView uniqueKey="catalog" className="nitro-catalog">
                    <NitroCardHeaderView headerText={ LocalizeText('catalog.title') } onCloseClick={ event => setIsVisible(false) } />
                    <NitroCardTabsView>
                        { rootNode && (rootNode.children.length > 0) && rootNode.children.map(child =>
                        {
                            if(!child.isVisible) return null;

                            return (
                                <NitroCardTabsItemView key={ child.pageId } isActive={ child.isActive } onClick={ event =>
                                {
                                    if(searchResult) setSearchResult(null);

                                    activateNode(child);
                                } }>
                                    { child.localization }
                                </NitroCardTabsItemView>
                            );
                        }) }
                    </NitroCardTabsView>
                    <Flex className="catalog-header">
                    <Column gap={ 0 } className="catalog-header-content">
                    {currentPage && rootNode && <CatalogIconView icon={ 0 } />}
                    {currentPage && rootNode && <Text bold className="catalog-header-title h-100">{'Category Name'}</Text>}
                        <Text className="catalog-header-desc" dangerouslySetInnerHTML={ { __html: currentPage && currentPage.localization.getText(0) } }/>
                    </Column>
                    <Flex className="catalog-header-image" style={{ backgroundImage: `url(${currentPage && currentPage.localization.getImage(0)})` }} />
                    </Flex>
                    <NitroCardContentView>
                        <Grid>
                            { !navigationHidden &&
                                <Column size={ 4 } overflow="hidden">
                                    { activeNodes && (activeNodes.length > 0) &&
                                        <CatalogNavigationView node={ activeNodes[0] } /> }
                                </Column> }
                            <Column size={ !navigationHidden ? 8 : 12 } overflow="hidden">
                                { GetCatalogLayout(currentPage, () => setNavigationHidden(true)) }
                            </Column>
                        </Grid>
                    </NitroCardContentView>
                </NitroCardView> }
            <CatalogGiftView />
            <MarketplacePostOfferView />
        </>
    );
}
