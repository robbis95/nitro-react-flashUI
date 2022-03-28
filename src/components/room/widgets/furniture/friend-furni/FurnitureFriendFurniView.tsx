import { FriendFurniConfirmLockMessageComposer, LoveLockFurniFinishedEvent, LoveLockFurniFriendConfirmedEvent, LoveLockFurniStartEvent, NitroEvent, RoomEngineTriggerWidgetEvent, RoomObjectVariable } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { GetRoomEngine, GetRoomSession, LocalizeText, RoomWidgetUpdateRoomObjectEvent } from '../../../../../api';
import { DraggableWindow, LayoutAvatarImageView, NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../../common';
import { BatchUpdates, UseEventDispatcherHook, UseMessageEventHook, UseRoomEngineEvent } from '../../../../../hooks';
import { useRoomContext } from '../../../RoomContext';
import { FurnitureEngravingLockData } from './FriendFurniLockData';

export const FurnitureFriendFurniView: FC<{}> = props =>
{
    const { eventDispatcher = null, widgetHandler = null } = useRoomContext();
    const [ engravingLockData, setEngravingLockData ] = useState<FurnitureEngravingLockData>(null);
    const [ engravingStage, setEngravingStage ] = useState(0);
    
    const onNitroEvent = (event: NitroEvent) =>
    {
        switch(event.type)
        {
            case RoomEngineTriggerWidgetEvent.REQUEST_FRIEND_FURNITURE_ENGRAVING: {
                const widgetEvent = (event as RoomEngineTriggerWidgetEvent);

                const roomObject = GetRoomEngine().getRoomObject(widgetEvent.roomId, widgetEvent.objectId, widgetEvent.category);
        
                if(!roomObject) return;
                
                const data = roomObject.model.getValue<string[]>(RoomObjectVariable.FURNITURE_DATA);
                const type = roomObject.model.getValue<number>(RoomObjectVariable.FURNITURE_FRIENDFURNI_ENGRAVING);
                
                if(data[0] === '1')
                {
                    if(data.length !== 6) return;
                    
                    BatchUpdates(() =>
                    {
                        setEngravingLockData(new FurnitureEngravingLockData(widgetEvent.objectId, widgetEvent.category, type, [ data[1], data[2] ], [ data[3], data[4] ], data[5]));
                        setEngravingStage(0);
                    });
                }
                return;
            }
            case RoomWidgetUpdateRoomObjectEvent.FURNI_REMOVED: {
                const widgetEvent = (event as RoomWidgetUpdateRoomObjectEvent);

                setEngravingLockData(prevState =>
                    {
                        if(!prevState || (widgetEvent.id !== prevState.objectId) || (widgetEvent.category !== prevState.category)) return prevState;

                        return null;
                    });
                return;
            }
        }
    };

    UseRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_FRIEND_FURNITURE_ENGRAVING, onNitroEvent);
    UseEventDispatcherHook(RoomWidgetUpdateRoomObjectEvent.FURNI_REMOVED, eventDispatcher, onNitroEvent);

    const onLoveLockFurniStartEvent = useCallback((event: LoveLockFurniStartEvent) =>
    {
        const parser = event.getParser();

        BatchUpdates(() =>
        {
            setEngravingLockData(new FurnitureEngravingLockData(parser.furniId));
            setEngravingStage(parser.start ? 1 : 2);
        });
    }, []);

    UseMessageEventHook(LoveLockFurniStartEvent, onLoveLockFurniStartEvent);

    const processAction = useCallback((type: string, value: string = null) =>
    {
        switch(type)
        {
            case 'close_view':
                setEngravingLockData(null);
                return;
            case 'accept_request':
                GetRoomSession().connection.send(new FriendFurniConfirmLockMessageComposer(engravingLockData.objectId, true));
                processAction('close_request');
                return;
            case 'reject_request':
                GetRoomSession().connection.send(new FriendFurniConfirmLockMessageComposer(engravingLockData.objectId, false));
                processAction('close_request');
                return;
            case 'close_request':
                setEngravingStage(0);
                setEngravingLockData(null);
                return;
        }
    }, [ engravingLockData ]);

    const onLoveLockDoneEvent = useCallback((event: LoveLockFurniFinishedEvent | LoveLockFurniFriendConfirmedEvent) =>
    {
        processAction('close_request');
    }, [ processAction ]);

    UseMessageEventHook(LoveLockFurniFinishedEvent, onLoveLockDoneEvent);
    UseMessageEventHook(LoveLockFurniFriendConfirmedEvent, onLoveLockDoneEvent);

    return (
        <>
            { (engravingStage > 0) && <NitroCardView className="nitro-engraving-lock" theme="primary-slim">
                <NitroCardHeaderView headerText={ LocalizeText('friend.furniture.confirm.lock.caption') } onCloseClick={ event => processAction('close_request') } />
                <NitroCardContentView>
                    <h5 className="text-black text-center fw-bold mt-2 mb-2">
                        { LocalizeText('friend.furniture.confirm.lock.subtitle') }
                    </h5>
                    <div className="d-flex justify-content-center mb-2">
                        <div className={ 'engraving-lock-stage-' + engravingStage }></div>
                    </div>
                    { engravingStage === 2 && <div className="text-small text-black text-center mb-2">{ LocalizeText('friend.furniture.confirm.lock.other.locked') }</div> }
                    <div className="d-flex">
                        <button className="btn btn-primary w-100 me-2" onClick={ event => processAction('reject_request') }>{ LocalizeText('friend.furniture.confirm.lock.button.cancel') }</button>
                        <button className="btn btn-success w-100" onClick={ event => processAction('accept_request') }>{ LocalizeText('friend.furniture.confirm.lock.button.confirm') }</button>
                    </div>
                </NitroCardContentView>
            </NitroCardView> }
            { engravingLockData && engravingLockData.usernames.length > 0 && <DraggableWindow handleSelector=".nitro-engraving-lock-view">
                <div className={ 'nitro-engraving-lock-view engraving-lock-' + engravingLockData.type }>
                    <div className="engraving-lock-close" onClick={ event => processAction('close_view') }></div>
                    <div className="d-flex justify-content-center">
                        <div className="engraving-lock-avatar">
                            <LayoutAvatarImageView figure={ engravingLockData.figures[0] } direction={ 2 } />
                        </div>
                        <div className="engraving-lock-avatar">
                            <LayoutAvatarImageView figure={ engravingLockData.figures[1] } direction={ 4 } />
                        </div>
                    </div>
                    <div className="text-center mt-1">
                        <div>
                            { engravingLockData.type === 0 && LocalizeText('lovelock.engraving.caption') }
                            { engravingLockData.type === 3 && LocalizeText('wildwest.engraving.caption') }
                        </div>
                        <div>{ engravingLockData.date }</div>
                        <div className="d-flex justify-content-center">
                            <div className="me-4">{ engravingLockData.usernames[0] }</div>
                            <div>{ engravingLockData.usernames[1] }</div>
                        </div>
                    </div>
                </div>
            </DraggableWindow> }
        </>
    );
}
