import { BonusRareInfoMessageEvent, GetBonusRareInfoMessageComposer, NitroConfiguration } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { LocalizeText, OpenUrl, SendMessageComposer } from '../../../../../api';
import { useMessageEvent } from '../../../../../hooks';

export interface BonusRareWidgetViewProps
{
    conf: any
}

export const BonusRareWidgetView: FC<BonusRareWidgetViewProps> = props =>
{
    const [ productType, setProductType ] = useState<string>(null);
    const [ productClassId, setProductClassId ] = useState<number>(null);
    const [ totalCoinsForBonus, setTotalCoinsForBonus ] = useState<number>(null);
    const [ coinsStillRequiredToBuy, setCoinsStillRequiredToBuy ] = useState<number>(null);
    const { conf = null } = props;

    useMessageEvent<BonusRareInfoMessageEvent>(BonusRareInfoMessageEvent, event =>
    {
        const parser = event.getParser();

        setProductType(parser.productType);
        setProductClassId(parser.productClassId);
        setTotalCoinsForBonus(parser.totalCoinsForBonus);
        setCoinsStillRequiredToBuy(parser.coinsStillRequiredToBuy);
    });

    useEffect(() =>
    {
        SendMessageComposer(new GetBonusRareInfoMessageComposer());
    }, []);

    if(!productType) return null;

    const getOption = (key: string) =>
    {
        const option = conf[key];

        if(!option) return null;

        switch(key)
        {
            case 'image':
                return NitroConfiguration.interpolate(option);

            case 'link':
                return NitroConfiguration.interpolate(option);
        }

        return option;
    }

    return (
        <div className="bonus-rare widget d-flex">
            {getOption('image') !== "" && (
                <div className="bonusrare-image flex-shrink-0" style={ { backgroundImage: `url(${ getOption('image') })` } } />
            )}
            <div className="flex flex-items justify-content-center align-items-center">
                <p className="bonusrare-header">{ LocalizeText('landing.view.bonus.rare.header', ['rarename', 'amount'], [ (productType).toString(), (totalCoinsForBonus).toString()]) }</p>
                <div className="bg-light-dark rounded overflow-hidden position-relative bonus-bar-container">
                    <div className="d-flex justify-content-center align-items-center w-100 h-100 position-absolute small top-0" style={{ zIndex: 2}}> 
                    { LocalizeText('landing.view.bonus.rare.status', ['totalCoins', 'totalCoinsForBonus'], [ ((totalCoinsForBonus - coinsStillRequiredToBuy)).toString(), (totalCoinsForBonus).toString()]) }</div>
                    <div className="small bg-info rounded position-absolute top-0 h-100" style={{ zIndex: 1, width: ((totalCoinsForBonus - coinsStillRequiredToBuy) / totalCoinsForBonus) * 100 + '%' }}></div>
                </div>
            </div>
            <button className="btn bonusrare-button ubuntu-bold" onClick={ event => OpenUrl(getOption('link')) }>{ LocalizeText('landing.view.bonus.rare.open.credits.page') }</button>
        </div>

    );
}
