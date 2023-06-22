import { BonusRareInfoMessageEvent, GetBonusRareInfoMessageComposer, NitroConfiguration } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { OpenUrl, SendMessageComposer } from '../../../../../api';
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
        <div className="bonus-rare">
            <div className="bonusrare-image flex-shrink-0" style={ { backgroundImage: `url(${ getOption('image') })` } } />
            <div className="flex flex-items justify-content-center align-items-center">
                <p className="bonusrare-header">{ getOption('header') }</p>
                <div className="bonus-bar-container ubuntu-bold">Faltam somente { (totalCoinsForBonus - coinsStillRequiredToBuy) + '/' + totalCoinsForBonus } créditos!</div>
                <div className="bonus-bar-progress" style={ { width: ((totalCoinsForBonus - coinsStillRequiredToBuy) / totalCoinsForBonus) * 100 + '%' } }></div>
            </div>
            <button className="btn bonusrare-button ubuntu-bold" onClick={ event => OpenUrl(getOption('link')) }>{ getOption('button') }</button>
        </div>
    );
}
