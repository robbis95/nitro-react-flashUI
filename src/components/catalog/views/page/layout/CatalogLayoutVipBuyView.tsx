import { ClubOfferData, GetClubOffersMessageComposer, PurchaseFromCatalogComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { CatalogPurchaseState, CreateLinkEvent, LocalizeText, SendMessageComposer } from '../../../../../api';
import { AutoGrid, Base, Button, Column, Flex, LayoutCurrencyIcon, LayoutLoadingSpinnerView, Text } from '../../../../../common';
import { CatalogEvent, CatalogPurchaseFailureEvent, CatalogPurchasedEvent } from '../../../../../events';
import { useCatalog, usePurse, useUiEvent } from '../../../../../hooks';
import { CatalogLayoutProps } from './CatalogLayout.types';

export const CatalogLayoutVipBuyView: FC<CatalogLayoutProps> = props =>
{
    const [ pendingOffer, setPendingOffer ] = useState<ClubOfferData>(null);
    const [ purchaseState, setPurchaseState ] = useState(CatalogPurchaseState.NONE);
    const { currentPage = null, catalogOptions = null } = useCatalog();
    const { purse = null, getCurrencyAmount = null } = usePurse();
    const { clubOffers = null } = catalogOptions;

    const onCatalogEvent = useCallback((event: CatalogEvent) =>
    {
        switch(event.type)
        {
            case CatalogPurchasedEvent.PURCHASE_SUCCESS:
                setPurchaseState(CatalogPurchaseState.NONE);
                return;
            case CatalogPurchaseFailureEvent.PURCHASE_FAILED:
                setPurchaseState(CatalogPurchaseState.FAILED);
                return;
        }
    }, []);

    useUiEvent(CatalogPurchasedEvent.PURCHASE_SUCCESS, onCatalogEvent);
    useUiEvent(CatalogPurchaseFailureEvent.PURCHASE_FAILED, onCatalogEvent);

    const getOfferText = useCallback((offer: ClubOfferData) =>
    {
        let offerText = '';

        if(offer.months > 0)
        {
            offerText = LocalizeText('catalog.vip.item.header.months', [ 'num_months' ], [ offer.months.toString() ]);
        }

        if(offer.extraDays > 0)
        {
            if(offerText !== '') offerText += ' ';
            
            offerText += (' ' + LocalizeText('catalog.vip.item.header.days', [ 'num_days' ], [ offer.extraDays.toString() ]));
        }

        return offerText;
    }, []);

    const getPurchaseHeader = useCallback(() =>
    {
        if(!purse) return '';

        const extensionOrSubscription = (purse.clubDays > 0 || purse.clubPeriods > 0) ? 'extension.' : 'subscription.';
        const daysOrMonths = ((pendingOffer.months === 0) ? 'days' : 'months');
        const daysOrMonthsText = ((pendingOffer.months === 0) ? pendingOffer.extraDays : pendingOffer.months);
        const locale = LocalizeText('catalog.vip.buy.confirm.' + extensionOrSubscription + daysOrMonths);

        return locale.replace('%NUM_' + daysOrMonths.toUpperCase() + '%', daysOrMonthsText.toString());
    }, [ pendingOffer, purse ]);

    const getPurchaseValidUntil = useCallback(() =>
    {
        let locale = LocalizeText('catalog.vip.buy.confirm.end_date');

        locale = locale.replace('%month%', pendingOffer.month.toString());
        locale = locale.replace('%day%', pendingOffer.day.toString());
        locale = locale.replace('%year%', pendingOffer.year.toString());

        return locale;
    }, [ pendingOffer ]);

    const getSubscriptionDetails = useMemo(() =>
    {
        const clubDays = purse.clubDays;
        const clubPeriods = purse.clubPeriods;
        const totalDays = (clubPeriods * 31) + clubDays;

        return LocalizeText('catalog.vip.extend.info', [ 'days' ], [ totalDays.toString() ]);
    }, [ purse ]);

    const purchaseSubscription = useCallback(() =>
    {
        if(!pendingOffer) return;

        setPurchaseState(CatalogPurchaseState.PURCHASE);
        SendMessageComposer(new PurchaseFromCatalogComposer(currentPage.pageId, pendingOffer.offerId, null, 1));
    }, [ pendingOffer, currentPage ]);

    const setOffer = useCallback((offer: ClubOfferData) =>
    {
        setPurchaseState(CatalogPurchaseState.CONFIRM);
        setPendingOffer(offer);
    }, []);

    const getPurchaseButton = useCallback(() =>
    {
        if(!pendingOffer) return null;

        if(pendingOffer.priceCredits > getCurrencyAmount(-1))
        {
            return <Button fullWidth variant="danger">{ LocalizeText('catalog.alert.notenough.title') }</Button>;
        }

        if(pendingOffer.priceActivityPoints > getCurrencyAmount(pendingOffer.priceActivityPointsType))
        {
            return <Button fullWidth variant="danger">{ LocalizeText('catalog.alert.notenough.activitypoints.title.' + pendingOffer.priceActivityPointsType) }</Button>;
        }

        switch(purchaseState)
        {
            case CatalogPurchaseState.CONFIRM:
                return <Button variant="warning" onClick={ purchaseSubscription }>{ LocalizeText('catalog.marketplace.confirm_title') }</Button>;
            case CatalogPurchaseState.PURCHASE:
                return <Button variant="primary" disabled><LayoutLoadingSpinnerView /></Button>;
            case CatalogPurchaseState.FAILED:
                return <Button variant="danger" disabled>{ LocalizeText('generic.failed') }</Button>;
            case CatalogPurchaseState.NONE:
            default:
                return <Button variant="success" onClick={ () => setPurchaseState(CatalogPurchaseState.CONFIRM) }>{ LocalizeText('buy') }</Button>;
        }
    }, [ pendingOffer, purchaseState, purchaseSubscription, getCurrencyAmount ]);

    useEffect(() =>
    {
        if(!clubOffers) SendMessageComposer(new GetClubOffersMessageComposer(1));
    }, [ clubOffers ]);

    return (
        <Column fullHeight className="px-4" gap={ 0 }>
            <Flex fullHeight overflow="hidden" gap={ 0 }>
                { currentPage.localization.getImage(1) && <img alt="" src={ purse.clubDays > 0 ? currentPage.localization.getImage(1) : currentPage.localization.getImage(1).split('/').slice(0, -1).join('/') + '/clubcat_pic.gif' } /> }
                <Column className="px-4 py-4" gap={ 0 }>
                    <Text bold>{ purse.clubDays > 0 ? LocalizeText('catalog.vip.extend.title') : LocalizeText('catalog.vip.buy.title') }</Text>
                    <Text small overflow="auto" dangerouslySetInnerHTML={ { __html: purse.clubDays > 0 ? getSubscriptionDetails : LocalizeText('catalog.vip.buy.info') } } />
                </Column>
            </Flex>
            <Column fullHeight size={ 7 } overflow="hidden" justifyContent="between">
                <AutoGrid columnCount={ 1 } className="nitro-catalog-layout-vip-buy-grid">
                    { clubOffers && (clubOffers.length > 0) && clubOffers.map((offer, index) =>
                    {
                        return (
                            <Column key={ index } fullWidth className="club-content px-1 py-1">
                                <Column className="content-title px-2 py-1">
                                    <Flex>
                                        <Base className="icon icon-catalogue-hc_small px-2 margin-image" />
                                        <Text bold variant="white" className="margin-text">{ getOfferText(offer) }</Text>
                                    </Flex>
                                </Column>
                                <Column className="content-description">
                                    <Flex alignItems="center" justifyContent="between">
                                        <Flex alignItems="center" justifyContent="end" gap={ 1 }>
                                            { (offer.priceCredits > 0) &&
                                                <Flex alignItems="center" justifyContent="end" gap={ 1 }>
                                                    <Text bold>{ offer.priceCredits }</Text>
                                                    <LayoutCurrencyIcon type={ -1 } />
                                                </Flex>
                                            }
                                            { (offer.priceActivityPoints > 0) && <Text bold>+</Text> }
                                            { (offer.priceActivityPoints > 0) &&
                                                <Flex alignItems="center" justifyContent="end" gap={ 1 }>
                                                    <Text bold>{ offer.priceActivityPoints }</Text>
                                                    <LayoutCurrencyIcon type={ offer.priceActivityPointsType } />
                                                </Flex>
                                            }
                                        </Flex>
                                        <Flex alignItems="center" justifyContent="end" gap={ 1 }>
                                            { (offer.giftable) && <Button variant="success">{ LocalizeText('catalog.purchase_confirmation.gift') }</Button> }
                                            { (!pendingOffer || pendingOffer !== offer) && <Button variant="success" onClick={ () => setOffer(offer) }>{ LocalizeText('buy') }</Button> }
                                            { (pendingOffer && pendingOffer === offer) && getPurchaseButton() }
                                        </Flex>
                                    </Flex>
                                </Column>
                            </Column>
                        );
                    }) }
                </AutoGrid>
                <Text pointer small center underline className="pb-2" onClick={ () => CreateLinkEvent('habboUI/open/hccenter') } dangerouslySetInnerHTML={ { __html: LocalizeText('catalog.vip.buy.hccenter') } }></Text>
            </Column>
        </Column>
    );
}
