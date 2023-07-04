import { GetOfficialSongIdMessageComposer, GetSongInfoMessageComposer, MusicPriorities, OfficialSongIdMessageEvent, TraxSongInfoMessageEvent } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { GetConfiguration, GetNitroInstance, LocalizeText, ProductTypeEnum, SendMessageComposer, getTypePrice } from '../../../../../api';
import { Button, Column, Flex, LayoutImage, Text } from '../../../../../common';
import { useCatalog, useMessageEvent } from '../../../../../hooks';
import { CatalogHeaderView } from '../../catalog-header/CatalogHeaderView';
import { CatalogAddOnBadgeWidgetView } from '../widgets/CatalogAddOnBadgeWidgetView';
import { CatalogItemGridWidgetView } from '../widgets/CatalogItemGridWidgetView';
import { CatalogLimitedItemWidgetView } from '../widgets/CatalogLimitedItemWidgetView';
import { CatalogPurchaseWidgetView } from '../widgets/CatalogPurchaseWidgetView';
import { CatalogSelectItemWidgetView } from '../widgets/CatalogSelectItemWidgetView';
import { CatalogTotalPriceWidget } from '../widgets/CatalogTotalPriceWidget';
import { CatalogLayoutProps } from './CatalogLayout.types';

export const CatalogLayoutSoundMachineView: FC<CatalogLayoutProps> = props =>
{
    const { page = null } = props;
    const [ songId, setSongId ] = useState(-1);
    const [ duration, setDuration ] = useState('');
    const [ isPlaying, setIsPlaying ] = useState(false);
    const [ officialSongId, setOfficialSongId ] = useState('');
    const { currentOffer = null, currentPage = null } = useCatalog();

    const previewSong = (previewSongId: number) => (GetNitroInstance().soundManager.musicController?.playSong(previewSongId, MusicPriorities.PRIORITY_PURCHASE_PREVIEW, 15, 0, 0, 0), setIsPlaying(true));
    const stopPreviewSong = () => (GetNitroInstance().soundManager.musicController?.stop(MusicPriorities.PRIORITY_PURCHASE_PREVIEW), setIsPlaying(false));
    
    useMessageEvent<OfficialSongIdMessageEvent>(OfficialSongIdMessageEvent, event =>
    {
        const parser = event.getParser();

        if(parser.officialSongId !== officialSongId) return;

        setSongId(parser.songId);
    });

    useMessageEvent<TraxSongInfoMessageEvent>(TraxSongInfoMessageEvent, event =>
    {
        const parser = event.getParser();

        const duration = parser.songs.find( song => song.id === songId ).length;
        const seconds = Math.floor((duration / 1000) % 60);
        const minutes = Math.floor((duration / 1000 / 60) % 60);

        setDuration([ minutes.toString(), seconds.toString().padStart(2, '0') ].join(':'));
    });

    useEffect(() =>
    {
        if(!currentOffer) return;

        const product = currentOffer.product;

        if(!product) return;

        if(product.extraParam.length > 0)
        {
            const id = parseInt(product.extraParam);

            if(id > 0)
            {
                setSongId(id);
            }
            else
            {
                setOfficialSongId(product.extraParam);
                SendMessageComposer(new GetOfficialSongIdMessageComposer(product.extraParam));
            }
        }
        else
        {
            setOfficialSongId('');
            setSongId(-1);
        }

        return () => (GetNitroInstance().soundManager.musicController?.stop(MusicPriorities.PRIORITY_PURCHASE_PREVIEW), setIsPlaying(false));
    }, [ currentOffer ]);

    useEffect(() =>
    {
        SendMessageComposer(new GetSongInfoMessageComposer(songId));
    }, [ songId ]);

    useEffect(() =>
    {
        return () => (GetNitroInstance().soundManager.musicController?.stop(MusicPriorities.PRIORITY_PURCHASE_PREVIEW), setIsPlaying(false));
    }, []);

    return (
        <>
            <Column overflow="hidden">
                <Column>{ GetConfiguration('catalog.headers') && <CatalogHeaderView imageUrl={ currentPage.localization.getImage(0) }/> }</Column>
                <Column className="px-4 py-4" overflow="hidden">
                    <Text className={ !currentOffer ? 'font-size-marketplace-small' : '' } bold={ !currentOffer ? false : true } dangerouslySetInnerHTML={ { __html: !currentOffer ? page.localization.getText(0) : currentOffer.localizationName } } />
                    <Text className="font-size-marketplace-small">{ !currentOffer ? '00:00' : LocalizeText('catalog.song.length', [ 'min', 'sec' ], [ duration.split(':')[0], duration.split(':')[1] ] ) }</Text>
                    <Column center className="mt-3">
                        { !currentOffer && !!page.localization.getImage(1) && <LayoutImage imageUrl={ page.localization.getImage(1) } /> }
                    </Column>
                    { currentOffer &&
                        <>
                            <Flex center overflow="hidden" className="mt-4">
                                { (currentOffer.product.productType !== ProductTypeEnum.BADGE) &&
                                    <>
                                        <LayoutImage imageUrl={ currentOffer.product.getIconUrl(currentOffer) } />
                                        <CatalogAddOnBadgeWidgetView className="bg-muted rounded bottom-1 end-1" />
                                    </>
                                }
                                { (currentOffer.product.productType === ProductTypeEnum.BADGE) && <CatalogAddOnBadgeWidgetView className="scale-2" /> }
                            </Flex>
                            <CatalogLimitedItemWidgetView position="absolute" className="end-0" />
                            <Flex className="mt-5" justifyContent="between">
                                <Flex className="p-2" style={ { backgroundColor: '#DADAD6', borderRadius: '12px' } }>
                                    <Text className="font-size-marketplace-small px-2 mt-1">{ LocalizeText('play_preview') }</Text>
                                    <Button className="px-2 p-0" onClick={ () => !isPlaying ? previewSong(songId) : stopPreviewSong() }>{ LocalizeText(!isPlaying ? 'play_preview_button' : 'playlist.editor.button.preview.stop') }</Button>
                                </Flex>
                                <CatalogTotalPriceWidget position="absolute" className={ `${ getTypePrice(currentOffer.priceType) } py-1 px-2 end-2` } />
                            </Flex>
                        </>
                    }
                </Column>
                <Column>
                    <Column position="absolute" className="grid-bg p-2 bottom-5 mb-1" size={ 7 } overflow="hidden" style={ { height: 'calc(100% - 480px)', width: '64%' } }>
                        <CatalogItemGridWidgetView />
                    </Column>
                    <Flex gap={ 2 } position="absolute" className="purchase-buttons align-items-end bottom-3" style={ { width: '64%' } }>
                        <CatalogPurchaseWidgetView />
                    </Flex>
                    <CatalogSelectItemWidgetView />
                </Column>
            </Column>
        </>
    );
}
