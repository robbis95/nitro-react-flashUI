/* eslint-disable no-template-curly-in-string */
import { HabboClubLevelEnum, RoomCreateComposer } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { GetClubMemberLevel, GetConfiguration, LocalizeText, SendMessageComposer } from '../../../api';
import { AutoGrid, Button, Column, Flex, LayoutCurrencyIcon, LayoutGridItem, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../common';
import { BatchUpdates } from '../../../hooks';
import { IRoomModel, RoomModels } from '../common/RoomModels';
import { useNavigatorContext } from '../NavigatorContext';

export const NavigatorRoomCreatorView: FC<{}> = props =>
{
    const [ maxVisitorsList, setMaxVisitorsList ] = useState<number[]>(null);
    const [ name, setName ] = useState<string>(null);
    const [ description, setDescription ] = useState<string>(null);
    const [ category, setCategory ] = useState<number>(null);
    const [ visitorsCount, setVisitorsCount ] = useState<number>(null);
    const [ tradesSetting, setTradesSetting ] = useState<number>(0);
    const [ selectedModelName, setSelectedModelName ] = useState<string>(RoomModels[0].name);
    const { categories = null } = useNavigatorContext();
    const [ isVisible, setIsVisible ] = useState(false);


    const getRoomModelImage = (name: string) => GetConfiguration<string>('images.url') + `/navigator/models/model_${ name }.png`;

    const selectModel = (model: IRoomModel, index: number) =>
    {
        if(!model || (model.clubLevel > GetClubMemberLevel())) return;

        setSelectedModelName(RoomModels[index].name);
    }

    const createRoom = () =>
    {
        SendMessageComposer(new RoomCreateComposer(name, description, 'model_' + selectedModelName, Number(category), Number(visitorsCount), tradesSetting));
    }

    useEffect(() =>
    {
        if(!maxVisitorsList)
        {
            const list = [];

            for(let i = 10; i <= 100; i = i + 10) list.push(i);

            BatchUpdates(() =>
            {
                setMaxVisitorsList(list);
                setVisitorsCount(list[0]);
            });
        }
    }, [ maxVisitorsList ]);

    useEffect(() =>
    {
        if(categories && categories.length) setCategory(categories[0].id);
    }, [ categories ]);

    return (
        <NitroCardView className="nitro-room-creator" theme="primary">
        <NitroCardHeaderView headerText={ LocalizeText('navigator.createroom.title') } onCloseClick={ event => { setIsVisible(false); } } />
        <NitroCardContentView>
            <div className="d-flex overflow-auto px-2 gap-2">
                <Column className="room-creator-info" size={ 6 } gap={ 1 } overflow="auto">
                    <Column gap={ 1 }>
                        <Text className="headline">{ LocalizeText('navigator.createroom.roomnameinfo') }</Text>
                        <input type="text" className="room-creator-form" maxLength={ 60 } onChange={ event => setName(event.target.value) } placeholder={ LocalizeText('navigator.createroom.roomnameinfo') } />
                    </Column>
                    <Column gap={ 1 }>
                        <Text className="headline">{ LocalizeText('navigator.createroom.roomdescinfo') }</Text>
                        <textarea className="room-creator-form-desc" maxLength={255} onChange={event => setDescription(event.target.value)} placeholder={ LocalizeText('navigator.createroom.roomdescinfo') } />
                    </Column>
                    <Column gap={ 1 }>
                        <Text className="headline">{ LocalizeText('navigator.category') }</Text>
                        <select className="form-select form-select-sm" onChange={ event => setCategory(Number(event.target.value)) }>
                            { categories && (categories.length > 0) && categories.map(category =>
                                {
                                    return <option key={ category.id } value={ category.id }>{ LocalizeText(category.name) }</option>
                                }) }
                        </select>
                    </Column>
                    <Column gap={ 1 }>
                        <Text className="headline">{ LocalizeText('navigator.maxvisitors') }</Text>
                        <select className="form-select form-select-sm" onChange={ event => setVisitorsCount(Number(event.target.value)) }>
                            { maxVisitorsList && maxVisitorsList.map(value =>
                                {
                                    return <option key={ value } value={ value }>{ value }</option>
                                }) }
                        </select>
                    </Column>
                    <Column gap={ 1 }>
                        <Text className="headline">{ LocalizeText('navigator.tradesettings') }</Text>
                        <select className="form-select form-select-sm" onChange={ event => setTradesSetting(Number(event.target.value)) }>
                            <option value="0">{ LocalizeText('navigator.roomsettings.trade_not_allowed') }</option>
                            <option value="1">{ LocalizeText('navigator.roomsettings.trade_not_with_Controller') }</option>
                            <option value="2">{ LocalizeText('navigator.roomsettings.trade_allowed') }</option>
                        </select>
                    </Column>
                    <Button fullWidth variant={ (!name || (name.length < 3)) ? 'danger' : 'success' } onClick={ createRoom } disabled={ (!name || (name.length < 3)) }>{ LocalizeText('navigator.createroom.create') }</Button>
                </Column>
                <AutoGrid className="room-creator-grid w-100" columnCount={ 2 } columnMinWidth={ 100 } columnMinHeight={ 50 } overflow="unset">
                    {
                        RoomModels.map((model, index )=>
                            {
                                return (<LayoutGridItem fullHeight key={ model.name } onClick={ () => selectModel(model, index) } itemActive={ (selectedModelName === model.name) } overflow="unset" gap={ 0 } className="room-creator-grid-item" disabled={ (GetClubMemberLevel() < model.clubLevel) }>
                                    <Flex fullHeight center overflow="hidden">
                                        <img alt="" src={ getRoomModelImage(model.name) } />
                                    </Flex>
                                    <Text>{ model.tileSize } { LocalizeText('navigator.createroom.tilesize') }</Text>
                                    { model.clubLevel > HabboClubLevelEnum.NO_CLUB && <LayoutCurrencyIcon position="absolute" className="top-1 end-1" type="hc" /> }
                                </LayoutGridItem>);
                            })
                    }
                </AutoGrid>
            </div>
            </NitroCardContentView>
        </NitroCardView>
    );
}
