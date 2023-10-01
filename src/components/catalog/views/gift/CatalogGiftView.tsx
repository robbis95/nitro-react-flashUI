import { GiftReceiverNotFoundEvent, PurchaseFromCatalogAsGiftComposer } from '@nitrots/nitro-renderer';
import { ChangeEvent, FC, useCallback, useEffect, useMemo, useState } from 'react';
import { ColorUtils, GetConfiguration, GetSessionDataManager, LocalizeText, MessengerFriend, ProductTypeEnum, SendMessageComposer } from '../../../../api';
import { Base, Button, ButtonGroup, Column, Flex, FormGroup, LayoutCurrencyIcon, LayoutFurniImageView, LayoutGiftTagView, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../common';
import { GiftColorButton } from '../../../../common/GiftColorButton';
import { CatalogEvent, CatalogInitGiftEvent, CatalogPurchasedEvent } from '../../../../events';
import { useCatalog, useFriends, useMessageEvent, useNotification, useUiEvent } from '../../../../hooks';

export const CatalogGiftView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState<boolean>(false);
    const [ pageId, setPageId ] = useState<number>(0);
    const [ offerId, setOfferId ] = useState<number>(0);
    const [ extraData, setExtraData ] = useState<string>('');
    const [ receiverName, setReceiverName ] = useState<string>('');
    const [ showMyFace, setShowMyFace ] = useState<boolean>(true);
    const [ message, setMessage ] = useState<string>('');
    const [ colors, setColors ] = useState<{ id: number, color: string }[]>([]);
    const [ selectedBoxIndex, setSelectedBoxIndex ] = useState<number>(0);
    const [ selectedRibbonIndex, setSelectedRibbonIndex ] = useState<number>(0);
    const [ selectedColorId, setSelectedColorId ] = useState<number>(0);
    const [ maxBoxIndex, setMaxBoxIndex ] = useState<number>(0);
    const [ maxRibbonIndex, setMaxRibbonIndex ] = useState<number>(0);
    const { catalogOptions = null } = useCatalog();
    const { friends } = useFriends();
    const { giftConfiguration = null } = catalogOptions;
    const [ boxTypes, setBoxTypes ] = useState<number[]>([]);
    const [ suggestions, setSuggestions ] = useState([]);
    const [ isAutocompleteVisible, setIsAutocompleteVisible ] = useState(true);
    const { simpleAlert = null } = useNotification();

    const onClose = useCallback(() =>
    {
        setIsVisible(false);
        setPageId(0);
        setOfferId(0);
        setExtraData('');
        setReceiverName('');
        setShowMyFace(true);
        setMessage('');
        setSelectedBoxIndex(0);
        setSelectedRibbonIndex(0);
        setIsAutocompleteVisible(false);
        setSuggestions([]);

        if(colors.length) setSelectedColorId(colors[0].id);
    }, [ colors ]);

    const isBoxDefault = useMemo(() =>
    {
        return giftConfiguration ? (giftConfiguration.defaultStuffTypes.findIndex(s => (s === boxTypes[selectedBoxIndex])) > -1) : false;
    }, [ boxTypes, giftConfiguration, selectedBoxIndex ]);

    const boxExtraData = useMemo(() =>
    {
        if (!giftConfiguration) return '';

        return ((boxTypes[selectedBoxIndex] * 1000) + giftConfiguration.ribbonTypes[selectedRibbonIndex]).toString();
    }, [ giftConfiguration, selectedBoxIndex, selectedRibbonIndex, boxTypes ]);

    const isColorable = useMemo(() =>
    {
        if (!giftConfiguration) return false;

        if (isBoxDefault) return false;

        const boxType = boxTypes[selectedBoxIndex];

        return (boxType === 8 || (boxType >= 3 && boxType <= 6)) ? false : true;
    }, [ giftConfiguration, selectedBoxIndex, isBoxDefault, boxTypes ]);

    const colourId = useMemo(() =>
    {
        return isBoxDefault ? boxTypes[selectedBoxIndex] : selectedColorId;
    },[ isBoxDefault, boxTypes, selectedBoxIndex, selectedColorId ])

    const allFriends = friends.filter( (friend: MessengerFriend) => friend.id !== -1 );

    const onTextChanged = (e: ChangeEvent<HTMLInputElement>) =>
    {
        const value = e.target.value;

        let suggestions = [];

        if (value.length > 0)
        {
            suggestions = allFriends.sort().filter((friend: MessengerFriend) => friend.name.includes(value));
        }

        setReceiverName(value);
        setIsAutocompleteVisible(true);
        setSuggestions(suggestions);
    };

    const selectedReceiverName = (friendName: string) =>
    {
        setReceiverName(friendName);
        setIsAutocompleteVisible(false);
    }

    const alertReceiverNotFound = () => simpleAlert(LocalizeText('catalog.gift_wrapping.receiver_not_found.info'), null, null, null, LocalizeText('catalog.gift_wrapping.receiver_not_found.title'));

    const handleAction = useCallback((action: string) =>
    {
        switch(action)
        {
            case 'prev_box':
                setSelectedBoxIndex(value => (value === 0 ? maxBoxIndex : value - 1));
                return;
            case 'next_box':
                setSelectedBoxIndex(value => (value === maxBoxIndex ? 0 : value + 1));
                return;
            case 'prev_ribbon':
                setSelectedRibbonIndex(value => (value === 0 ? maxRibbonIndex : value - 1));
                return;
            case 'next_ribbon':
                setSelectedRibbonIndex(value => (value === maxRibbonIndex ? 0 : value + 1));
                return;
            case 'buy':
                if(!receiverName || (receiverName.length === 0)) return alertReceiverNotFound();

                SendMessageComposer(new PurchaseFromCatalogAsGiftComposer(pageId, offerId, extraData, receiverName, message, colourId , selectedBoxIndex, selectedRibbonIndex, showMyFace));
                return;
        }
    }, [ colourId, extraData, maxBoxIndex, maxRibbonIndex, message, offerId, pageId, receiverName, selectedBoxIndex, selectedRibbonIndex, showMyFace ]);

    useMessageEvent<GiftReceiverNotFoundEvent>(GiftReceiverNotFoundEvent, event => alertReceiverNotFound());

    useUiEvent([
        CatalogPurchasedEvent.PURCHASE_SUCCESS,
        CatalogEvent.INIT_GIFT ], event =>
    {
        switch(event.type)
        {
            case CatalogPurchasedEvent.PURCHASE_SUCCESS:
                onClose();
                return;
            case CatalogEvent.INIT_GIFT:
                const castedEvent = (event as CatalogInitGiftEvent);

                onClose();

                setPageId(castedEvent.pageId);
                setOfferId(castedEvent.offerId);
                setExtraData(castedEvent.extraData);
                setIsVisible(true);
                return;
        }
    });

    const createBoxTypes = useCallback(() =>
    {
        if (!giftConfiguration) return;

        setBoxTypes(prev =>
        {
            let newPrev = [ ...giftConfiguration.boxTypes ];

            newPrev.push(giftConfiguration.defaultStuffTypes[ Math.floor((Math.random() * (giftConfiguration.defaultStuffTypes.length - 1))) ]);

            setMaxBoxIndex(newPrev.length- 1);
            setMaxRibbonIndex(newPrev.length - 1);

            return newPrev;
        })
    },[ giftConfiguration ])

    useEffect(() =>
    {
        if(!giftConfiguration) return;

        const newColors: { id: number, color: string }[] = [];

        for(const colorId of giftConfiguration.stuffTypes)
        {
            const giftData = GetSessionDataManager().getFloorItemData(colorId);

            if(!giftData) continue;

            if(giftData.colors && giftData.colors.length > 0) newColors.push({ id: colorId, color: ColorUtils.makeColorNumberHex(giftData.colors[0]) });
        }

        createBoxTypes();

        if(newColors.length)
        {
            setSelectedColorId(newColors[0].id);
            setColors(newColors);
        }
    }, [ giftConfiguration, createBoxTypes ]);

    useEffect(() =>
    {
        if (!isVisible) return;

        createBoxTypes();
    },[ createBoxTypes, isVisible ])

    if(!giftConfiguration || !giftConfiguration.isEnabled || !isVisible) return null;

    const boxName = 'catalog.gift_wrapping_new.box.' + (isBoxDefault ? 'default' : boxTypes[selectedBoxIndex]);
    const ribbonName = `catalog.gift_wrapping_new.ribbon.${ selectedRibbonIndex }`;
    const priceText = 'catalog.gift_wrapping_new.' + (isBoxDefault ? 'freeprice' : 'price');

    return (
        <NitroCardView uniqueKey="catalog-gift" className="nitro-catalog-gift no-resize" theme="primary">
            <NitroCardHeaderView headerText={ LocalizeText('catalog.gift_wrapping.title') } onCloseClick={ onClose } />
            <NitroCardContentView className="text-black px-4">
                <FormGroup column>
                    <Flex grow gap={ 2 } alignItems="center">
                        <input type="text" className="form-control form-control-sm" value={ receiverName } placeholder={ LocalizeText('catalog.gift_wrapping_new.name_hint') } onChange={ (e) => onTextChanged(e) } />
                        <Base className="icon pencil-icon" />
                    </Flex>
                    { (suggestions.length > 0 && isAutocompleteVisible) &&
                        <Column gap={ 0 } className="autocomplete-gift-container">
                            { suggestions.map((friend: MessengerFriend) => (
                                <Base key={ friend.id } className="autocomplete-gift-item px-2" onClick={ (e) => selectedReceiverName(friend.name) }>{ friend.name }</Base>
                            )) }
                        </Column>
                    }
                </FormGroup>
                <LayoutGiftTagView figure={ GetSessionDataManager().figure } userName={ GetSessionDataManager().userName } message={ message } editable={ true } onChange={ (value) => setMessage(value) } />
                <Base className="form-check">
                    { GetConfiguration('catalog.gifts.show.my.face') &&
                        <>
                            <input className="form-check-input" type="checkbox" name="showMyFace" checked={ showMyFace } onChange={ (e) => setShowMyFace(value => !value) } />
                            <label className="form-check-label">{ LocalizeText('catalog.gift_wrapping.show_face.title') }</label>
                        </>
                    }
                </Base>
                <Flex alignItems="center" gap={ 2 }>
                    { selectedColorId &&
                        <Base className="gift-preview">
                            <LayoutFurniImageView productType={ ProductTypeEnum.FLOOR } productClassId={ colourId } extraData={ boxExtraData } />
                        </Base> }
                    <Column gap={ 1 }>
                        <Flex gap={ 2 }>
                            <ButtonGroup>
                                <Button variant="primary" className="volter-button btn-sm" onClick={ () => handleAction('prev_box') }>
                                    <Base className="flex-shrink-0 icon icon-chevron_left_gift" />
                                </Button>
                                <Button variant="primary" className="volter-button btn-sm" onClick={ () => handleAction('next_box') }>
                                    <Base className="flex-shrink-0 icon icon-chevron_right_gift" />
                                </Button>
                            </ButtonGroup>
                            <Column gap={ 0 }>
                                <Text small fontWeight="bold">{ LocalizeText(boxName) }</Text>
                                <Flex alignItems="center" gap={ 1 }>
                                    <Text small>{ LocalizeText(priceText, [ 'price' ], [ giftConfiguration.price.toString() ]) }</Text>
                                    { !isBoxDefault && <LayoutCurrencyIcon type={ -1 } /> }
                                </Flex>
                            </Column>
                        </Flex>
                        <Flex alignItems="center" gap={ 2 } className={ isColorable ? '' : 'opacity-50' }>
                            <ButtonGroup>
                                <Button variant="primary" className={ `volter-button btn-sm ${ !isColorable ? 'pe-none' : '' }` } onClick={ () => handleAction('prev_ribbon') }>
                                    <Base className="flex-shrink-0 icon icon-chevron_left_gift" />
                                </Button>
                                <Button variant="primary" className={ `volter-button btn-sm ${ !isColorable ? 'pe-none' : '' }` } onClick={ () => handleAction('next_ribbon') }>
                                    <Base className="flex-shrink-0 icon icon-chevron_right_gift" />
                                </Button>
                            </ButtonGroup>
                            <Text small fontWeight="bold">{ LocalizeText(ribbonName) }</Text>
                        </Flex>
                    </Column>
                </Flex>
                <Column gap={ 1 } className={ isColorable ? '' : 'opacity-50' }>
                    <Text small fontWeight="bold">
                        { LocalizeText('catalog.gift_wrapping.pick_color') }
                    </Text>
                    <ButtonGroup fullWidth className={ `justify-content-center gap-1 ${ !isColorable ? 'pe-none' : '' }` }>
                        { colors.map(color => <GiftColorButton key={ color.id } variant="dark" active={ (color.id === selectedColorId) } disabled={ !isColorable } style={ { backgroundColor: color.color, borderRadius: '4px' } } onClick={ () => setSelectedColorId(color.id) } />) }
                    </ButtonGroup>
                </Column>
                <Flex className="mt-2" justifyContent="between" alignItems="center">
                    <Text underline pointer onClick={ onClose } className="text-black">
                        { LocalizeText('cancel') }
                    </Text>
                    <Button variant="primary" onClick={ () => handleAction('buy') }>
                        { LocalizeText('catalog.gift_wrapping.give_gift') }
                    </Button>
                </Flex>
            </NitroCardContentView>
        </NitroCardView>
    );
};
