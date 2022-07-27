import { MouseEventType, RoomObjectCategory } from '@nitrots/nitro-renderer';
import { Dispatch, FC, PropsWithChildren, SetStateAction, useEffect, useRef } from 'react';
import { CreateLinkEvent, DispatchUiEvent, GetRoomEngine, GetRoomSession, GetSessionDataManager, GetUserProfile, LocalizeText } from '../../api';
import { Base, Column, Flex, LayoutItemCountView, Text } from '../../common';
import { GuideToolEvent } from '../../events';

interface ToolbarMeViewProps
{
    useGuideTool: boolean;
    unseenAchievementCount: number;
    setMeExpanded: Dispatch<SetStateAction<boolean>>;
}

export const ToolbarMeView: FC<PropsWithChildren<ToolbarMeViewProps>> = props =>
{
    const { useGuideTool = false, unseenAchievementCount = 0, setMeExpanded = null, children = null, ...rest } = props;
    const elementRef = useRef<HTMLDivElement>();

    useEffect(() =>
    {
        const roomSession = GetRoomSession();

        if(!roomSession) return;

        GetRoomEngine().selectRoomObject(roomSession.roomId, roomSession.ownRoomIndex, RoomObjectCategory.UNIT);
    }, []);

    useEffect(() =>
    {
        const onClick = (event: MouseEvent) => setMeExpanded(false);

        document.addEventListener('click', onClick);

        return () => document.removeEventListener(MouseEventType.MOUSE_CLICK, onClick);
    }, [ setMeExpanded ]);

    return (
        <Flex innerRef={ elementRef } alignItems="center" className="nitro-toolbar-me p-2" gap={ 3 }>
            { useGuideTool &&
                <Column gap={ 1 } alignItems="center" onClick={ event => DispatchUiEvent(new GuideToolEvent(GuideToolEvent.TOGGLE_GUIDE_TOOL)) }>
                    <Base pointer className="navigation-item icon icon-me-helper-tool" /> 
                    <Text className="me-text">{ LocalizeText('widget.memenu.guide') }</Text>
                </Column> }
            <Column gap={ 1 } alignItems="center" onClick={ event => CreateLinkEvent('achievements/toggle') }>
                <Base pointer className="navigation-item icon icon-me-achievements">
                    { (unseenAchievementCount > 0) &&
                    <LayoutItemCountView count={ unseenAchievementCount } /> }
                </Base>
                <Text className="me-text">{ LocalizeText('widget.memenu.achievements') }</Text>
            </Column>
            <Column gap={ 1 } alignItems="center" onClick={ event => GetUserProfile(GetSessionDataManager().userId) }>
                <Base pointer className="navigation-item icon icon-me-profile" />
                <Text className="me-text">{ LocalizeText('widget.memenu.profile') }</Text>
            </Column>
            <Column gap={ 1 } alignItems="center" onClick={ event => CreateLinkEvent('navigator/search/myworld_view') }>
                <Base pointer className="navigation-item icon icon-me-rooms" />
                <Text className="me-text">{ LocalizeText('widget.memenu.myrooms') }</Text>
            </Column>
            <Column gap={ 1 } alignItems="center" onClick={ event => CreateLinkEvent('avatar-editor/toggle') }>
                <Base pointer className="navigation-item icon icon-me-clothing" />
                <Text className="me-text">{ LocalizeText('widget.memenu.myclothes') }</Text>
            </Column>
            { children }
        </Flex>
    );
}
