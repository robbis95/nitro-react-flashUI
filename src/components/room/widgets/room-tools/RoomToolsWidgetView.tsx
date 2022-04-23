import { GetGuestRoomResultEvent, RoomLikeRoomComposer } from '@nitrots/nitro-renderer';
import classNames from 'classnames';
import { FC, useCallback, useEffect, useState } from 'react';
import { CreateLinkEvent, GetRoomEngine, LocalizeText, SendMessageComposer } from '../../../../api';
import { Base, Column, Flex, Text, TransitionAnimation, TransitionAnimationTypes } from '../../../../common';
import { UseMessageEventHook, useSharedNavigatorData } from '../../../../hooks';
import { useRoomContext } from '../../RoomContext';

export const RoomToolsWidgetView: FC<{}> = props =>
{
    const [ isZoomedIn, setIsZoomedIn ] = useState<boolean>(false);
    const [ roomName, setRoomName ] = useState<string>(null);
    const [ roomOwner, setRoomOwner ] = useState<string>(null);
    const [ roomTags, setRoomTags ] = useState<string[]>(null);
    const [ roomInfoDisplay, setRoomInfoDisplay ] = useState<boolean>(false);
    const [ isOpen, setIsOpen ] = useState<boolean>(false);
    const [ navigatorData, setNavigatorData ] = useSharedNavigatorData();
    const { roomSession = null, widgetHandler = null } = useRoomContext();
    const [ show, setShow ] = useState(true);

    const handleToolClick = (action: string) =>
    {
        switch(action)
        {
            case 'settings':
                CreateLinkEvent('navigator/toggle-room-info');
                return;
            case 'zoom':
                setIsZoomedIn(prevValue =>
                {
                    let scale = GetRoomEngine().getRoomInstanceRenderingCanvasScale(roomSession.roomId, 1);
                    
                    if(!prevValue) scale /= 2;
                    else scale *= 2;
                    
                    GetRoomEngine().setRoomInstanceRenderingCanvasScale(roomSession.roomId, 1, scale);

                    return !prevValue;
                });
                return;
            case 'chat_history':
                CreateLinkEvent('chat-history/toggle');
                return;
            case 'like_room':
                SendMessageComposer(new RoomLikeRoomComposer(1));
                return;
            case 'toggle_room_link':
                CreateLinkEvent('navigator/toggle-room-link');
                return;
        }
    }

    const onGetGuestRoomResultEvent = useCallback((event: GetGuestRoomResultEvent) =>
    {
        const parser = event.getParser();

        if(!parser.roomEnter) return;

        if(roomName !== parser.data.roomName) setRoomName(parser.data.roomName);
        if(roomOwner !== parser.data.ownerName) setRoomOwner(parser.data.ownerName);
        if(roomTags !== parser.data.tags) setRoomTags(parser.data.tags);
    }, [ roomName, roomOwner, roomTags ]);

    UseMessageEventHook(GetGuestRoomResultEvent, onGetGuestRoomResultEvent);

    useEffect(() =>
    {
        setIsOpen(true);

        const timeout = setTimeout(() => setIsOpen(false), 5000);

        return () => clearTimeout(timeout);
    }, [ roomName, roomOwner, roomTags ]);
    
    return (
        <Flex gap={ 2 } className="nitro-room-tools-container">
            <div className="btn-toggle toggle-roomtool d-flex align-items-center" onClick={() => setShow(!show)}>
                <div className={'toggle-icon ' + classNames({ 'right': !show, 'left': show })} />
            </div>
            {show && (
            <><Flex gap={ 0 } center className="nitro-room-tools p-3 px-3">
                <Column center className="p-1">
                    <Base pointer title={ LocalizeText('room.settings.button.text') } className="icon icon-cog" onClick={ () => handleToolClick('settings') } />
                    <Base pointer title={ LocalizeText('room.zoom.button.text') } onClick={ () => handleToolClick('zoom') } className={ 'icon ' + classNames({ 'icon-zoom-less': !isZoomedIn, 'icon-zoom-more': isZoomedIn }) } />
                    <Base pointer title={ LocalizeText('room.chathistory.button.text') } onClick={ () => handleToolClick('chat_history') } className="icon icon-chat-history" />
                    { navigatorData.canRate &&
                    <Base pointer title={ LocalizeText('room.like.button.text') } onClick={ () => handleToolClick('like_room') } className="icon icon-like-room" /> }
                    <Base pointer title={ LocalizeText('room.like.button.text') } onClick={ () => handleToolClick('toggle_room_link') } className="icon icon-link-room" />
                </Column>
                <Column>
                    <Flex className="w-100 room-tool-item">
                    <Text underline small onClick={() => handleToolClick('settings')} >{LocalizeText('room.settings.button.text')}</Text>
                    </Flex>
                    <Flex className="w-100 room-tool-item">
                    <Text underline small onClick={() => handleToolClick('zoom')} >{LocalizeText('room.zoom.button.text')}</Text>
                    </Flex>
                    <Flex className="w-100 room-tool-item">
                    <Text underline small onClick={() => handleToolClick('chat_history')}>{LocalizeText('room.chathistory.button.text')}</Text></Flex>
                    {navigatorData.canRate &&
                    <Flex className="w-100 room-tool-item">
                        <Text underline small onClick={() => handleToolClick('like_room')} >{LocalizeText('room.like.button.text')}</Text>
                        </Flex>}
                    <Flex className="w-100 room-tool-item">
                        <Text underline small onClick={() => handleToolClick('toggle_room_link')}>{LocalizeText('navigator.embed.caption')}</Text>
                    </Flex>
                </Column>

                    
                </Flex>
                
                <Column justifyContent="center">
                        <TransitionAnimation type={TransitionAnimationTypes.SLIDE_LEFT} inProp={isOpen} timeout={300}>
                            <Column center gap={ 2 }>
                                <Column className="nitro-room-tools-info py-2 px-3">
                                    <Column gap={1}>
                                        <Text wrap variant="white" fontSize={4}>{roomName}</Text>
                                        <Text variant="muted" fontSize={5}>{roomOwner}</Text>
                                    </Column>
                                    {roomTags && roomTags.length > 0 &&
                                        <Flex gap={2}>
                                            {roomTags.map((tag, index) => <Text key={index} small variant="white" className="rounded bg-primary p-1">#{tag}</Text>)}
                                        </Flex>}
                                </Column>
                            </Column>
                        </TransitionAnimation>
                    </Column></>
            )}
        </Flex>
    );
}
