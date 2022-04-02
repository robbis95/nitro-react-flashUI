import { GetGuestRoomResultEvent, RoomLikeRoomComposer } from '@nitrots/nitro-renderer';
import classNames from 'classnames';
import { FC, useCallback, useEffect, useState } from 'react';
import { CreateLinkEvent, LocalizeText, RoomWidgetZoomToggleMessage, SendMessageComposer } from '../../../../api';
import { Base, Column, Flex, Text, TransitionAnimation, TransitionAnimationTypes } from '../../../../common';
import { BatchUpdates, UseMessageEventHook, useSharedNavigatorData } from '../../../../hooks';
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
    const { widgetHandler = null } = useRoomContext();
    const [ show, setShow ] = useState(false);


    const handleToolClick = (action: string) =>
    {
        switch(action)
        {
            case 'settings':
                CreateLinkEvent('navigator/toggle-room-info');
                return;
            case 'zoom':
                widgetHandler.processWidgetMessage(new RoomWidgetZoomToggleMessage(!isZoomedIn));
                setIsZoomedIn(value => !value);
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

        BatchUpdates(() =>
        {
            if(roomName !== parser.data.roomName) setRoomName(parser.data.roomName);
            if(roomOwner !== parser.data.ownerName) setRoomOwner(parser.data.ownerName);
            if(roomTags !== parser.data.tags) setRoomTags(parser.data.tags);
        });
    }, [ roomName, roomOwner, roomTags ]);

    UseMessageEventHook(GetGuestRoomResultEvent, onGetGuestRoomResultEvent);

    useEffect(() =>
    {
        setIsOpen(true);

        const timeout = setTimeout(() => setIsOpen(false), 5000);

        return () => clearTimeout(timeout);
    }, [ roomName, roomOwner, roomTags ]);
    
    return (
        <Flex className="nitro-room-tools-container">
            <div className="btn-toggle toggle-roomtool d-flex align-items-center" onClick={() => setShow(!show)}>
                <div className={'toggle-icon ' + classNames({ 'right': !show, 'left': show })} />
            </div>
            {show && (
            <><Column center className="nitro-room-tools p-2">
                    <div className="w-100 room-tool-item" onClick={() => handleToolClick('settings')}>
                    <Base pointer title={LocalizeText('room.settings.button.text')} className="float-start icon icon-cog" />
                    <p>{LocalizeText('room.settings.button.text')}</p>
                    </div>
                    <div className="w-100 room-tool-item" onClick={() => handleToolClick('zoom')}>
                    <Base pointer title={LocalizeText('room.zoom.button.text')} className={'float-start icon ' + classNames({ 'icon-zoom-less': !isZoomedIn, 'icon-zoom-more': isZoomedIn })} />
                    <p>{LocalizeText('room.zoom.button.text')}</p>
                    </div>
                    <div className="w-100 room-tool-item" onClick={() => handleToolClick('chat_history')}>
                    <Base pointer title={LocalizeText('room.chathistory.button.text')} className="icon icon-chat-history float-start" />
                    <p>{LocalizeText('room.chathistory.button.text')}</p></div>
                    {navigatorData.canRate &&
                    <div className="w-100 room-tool-item" onClick={() => handleToolClick('like_room')}>
                        <Base pointer title={LocalizeText('room.like.button.text')} className="icon icon-like-room float-start" />
                        <p>{LocalizeText('room.like.button.text')}</p>
                        </div>}
                </Column></>
            )}
            <Column justifyContent="center">
                        <TransitionAnimation type={TransitionAnimationTypes.SLIDE_LEFT} inProp={isOpen} timeout={300}>
                            <Column center gap={ 2 }>
                                <Column className="nitro-room-tools-info rounded py-2 px-3">
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
                    </Column>
        </Flex>
    );
}
