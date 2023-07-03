import { ILinkEventTracker, RoomEngineEvent, RoomId, RoomObjectCategory, RoomObjectType } from '@nitrots/nitro-renderer';
import { FC, useEffect, useRef, useState } from 'react';
import { AddEventLinkTracker, CreateLinkEvent, GetRoomSession, ISelectedUser, RemoveLinkEventTracker } from '../../api';
import { Base, Button, DraggableWindowPosition, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../common';
import { useModTools, useObjectSelectedEvent, useRoomEngineEvent } from '../../hooks';
import { ModToolsChatlogView } from './views/room/ModToolsChatlogView';
import { ModToolsRoomView } from './views/room/ModToolsRoomView';
import { ModToolsTicketsView } from './views/tickets/ModToolsTicketsView';
import { ModToolsUserChatlogView } from './views/user/ModToolsUserChatlogView';
import { ModToolsUserView } from './views/user/ModToolsUserView';

export const ModToolsView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const [ currentRoomId, setCurrentRoomId ] = useState<number>(-1);
    const [ selectedUser, setSelectedUser ] = useState<ISelectedUser>(null);
    const [ isTicketsVisible, setIsTicketsVisible ] = useState(false);
    const { openRooms = [], openRoomChatlogs = [], openUserChatlogs = [], openUserInfos = [], openRoomInfo = null, closeRoomInfo = null, toggleRoomInfo = null, openRoomChatlog = null, closeRoomChatlog = null, toggleRoomChatlog = null, openUserInfo = null, closeUserInfo = null, toggleUserInfo = null, openUserChatlog = null, closeUserChatlog = null, toggleUserChatlog = null } = useModTools();
    const elementRef = useRef<HTMLDivElement>(null);

    useRoomEngineEvent<RoomEngineEvent>([
        RoomEngineEvent.INITIALIZED,
        RoomEngineEvent.DISPOSED
    ], event =>
    {
        if(RoomId.isRoomPreviewerId(event.roomId)) return;

        switch(event.type)
        {
            case RoomEngineEvent.INITIALIZED:
                setCurrentRoomId(event.roomId);
                return;
            case RoomEngineEvent.DISPOSED:
                setCurrentRoomId(-1);
                return;
        }
    });

    useObjectSelectedEvent(event =>
    {
        if(event.category !== RoomObjectCategory.UNIT) return;

        const roomSession = GetRoomSession();

        if(!roomSession) return;

        const userData = roomSession.userDataManager.getUserDataByIndex(event.id);

        if(!userData || userData.type !== RoomObjectType.USER) return;

        setSelectedUser({ userId: userData.webID, username: userData.name });
    });

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
                    case 'open-room-info':
                        openRoomInfo(Number(parts[2]));
                        return;
                    case 'close-room-info':
                        closeRoomInfo(Number(parts[2]));           
                        return;
                    case 'toggle-room-info':
                        toggleRoomInfo(Number(parts[2]));
                        return;
                    case 'open-room-chatlog':
                        openRoomChatlog(Number(parts[2]));
                        return;
                    case 'close-room-chatlog':
                        closeRoomChatlog(Number(parts[2]));             
                        return;
                    case 'toggle-room-chatlog':
                        toggleRoomChatlog(Number(parts[2]));
                        return;
                    case 'open-user-info':
                        openUserInfo(Number(parts[2]));
                        return;
                    case 'close-user-info':
                        closeUserInfo(Number(parts[2]));             
                        return;
                    case 'toggle-user-info':
                        toggleUserInfo(Number(parts[2]));
                        return;
                    case 'open-user-chatlog':
                        openUserChatlog(Number(parts[2]));   
                        return;
                    case 'close-user-chatlog':
                        closeUserChatlog(Number(parts[2]));              
                        return;
                    case 'toggle-user-chatlog':
                        toggleUserChatlog(Number(parts[2]));
                        return;
                }
            },
            eventUrlPrefix: 'mod-tools/'
        };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, [ openRoomInfo, closeRoomInfo, toggleRoomInfo, openRoomChatlog, closeRoomChatlog, toggleRoomChatlog, openUserInfo, closeUserInfo, toggleUserInfo, openUserChatlog, closeUserChatlog, toggleUserChatlog ]);

    return (
        <>
            { isVisible &&
                <NitroCardView uniqueKey="mod-tools" className="nitro-mod-tools no-resize" windowPosition={ DraggableWindowPosition.TOP_LEFT } theme="primary-modtool" >
                    <NitroCardHeaderView hideButtonClose headerText={ 'Mod Tools' } onCloseClick={ event => setIsVisible(false) } />
                    <NitroCardContentView className="text-black" gap={ 1 }>
                        <Button className={ `btn btn-mod-tools position-relative ${ (currentRoomId <= 0) ? 'pe-none' : '' }` } gap={ 1 } onClick={ event => CreateLinkEvent(`mod-tools/toggle-room-info/${ currentRoomId }`) }>
                            <Base className="icon icon-small-room position-absolute start-1" />
                            <Text overflow="hidden" variant="black" className={ `text-nowrap pe-4 me-3 ${ (currentRoomId <= 0) ? 'opacity-25' : '' }` }>Room Tool</Text>
                        </Button>
                        <Button className={ `btn btn-mod-tools position-relative ${ (currentRoomId <= 0) ? 'pe-none' : '' }` } innerRef={ elementRef } gap={ 1 } onClick={ event => CreateLinkEvent(`mod-tools/toggle-room-chatlog/${ currentRoomId }`) }>
                            <Base className="icon icon-chat-history position-absolute start-1" />
                            <Text overflow="hidden" variant="black" className={ `text-nowrap pe-4 me-1 ${ (currentRoomId <= 0) ? 'opacity-25' : '' }` }>Chatlog Tool</Text>
                        </Button>
                        <Button className={ `btn btn-mod-tools position-relative ${ (!selectedUser) ? 'pe-none' : '' }` } gap={ 1 } onClick={ () => CreateLinkEvent(`mod-tools/toggle-user-info/${ selectedUser.userId }`) }>
                            <Base className="icon icon-user position-absolute start-1" />
                            <Text overflow="hidden" variant="black" className={ `text-nowrap pe-5 ${ !selectedUser ? 'me-5 opacity-25' : 'me-4' }` } style={ { marginLeft: '12px' } }>User: { selectedUser ? selectedUser.username : '' }</Text>
                        </Button>
                        <Button className="btn btn-mod-tools position-relative" gap={ 1 } onClick={ () => setIsTicketsVisible(prevValue => !prevValue) }>
                            <Base className="icon icon-tickets position-absolute start-1" />
                            <Text overflow="hidden" variant="black" className="text-nowrap pe-2 me-2">Ticket browser</Text>
                        </Button>
                    </NitroCardContentView>
                </NitroCardView> }
            { (openRooms.length > 0) && openRooms.map(roomId => <ModToolsRoomView key={ roomId } roomId={ roomId } onCloseClick={ () => CreateLinkEvent(`mod-tools/close-room-info/${ roomId }`) } />) }
            { (openRoomChatlogs.length > 0) && openRoomChatlogs.map(roomId => <ModToolsChatlogView key={ roomId } roomId={ roomId } onCloseClick={ () => CreateLinkEvent(`mod-tools/close-room-chatlog/${ roomId }`) } />) }
            { (openUserInfos.length > 0) && openUserInfos.map(userId => <ModToolsUserView key={ userId } userId={ userId } onCloseClick={ () => CreateLinkEvent(`mod-tools/close-user-info/${ userId }`) }/>) }
            { (openUserChatlogs.length > 0) && openUserChatlogs.map(userId => <ModToolsUserChatlogView key={ userId } userId={ userId } onCloseClick={ () => CreateLinkEvent(`mod-tools/close-user-chatlog/${ userId }`) }/>) }
            { isTicketsVisible && <ModToolsTicketsView onCloseClick={ () => setIsTicketsVisible(false) } /> }
        </>
    );
}
