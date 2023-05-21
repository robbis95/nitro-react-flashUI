import { MouseEventType, RoomObjectCategory } from '@nitrots/nitro-renderer';
import { Dispatch, FC, PropsWithChildren, SetStateAction, useEffect, useRef } from 'react';
import { CreateLinkEvent, DispatchUiEvent, GetConfiguration, GetRoomEngine, GetRoomSession, GetSessionDataManager, GetUserProfile, LocalizeText } from '../../api';
import { Base, Flex, Column, LayoutItemCountView, Text } from '../../common';
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
			{ (GetConfiguration('guides.enabled') && useGuideTool) &&
				<Column className="me-text" gap={ 1 } alignItems="center" onClick={ event => DispatchUiEvent(new GuideToolEvent(GuideToolEvent.TOGGLE_GUIDE_TOOL)) }>
					<Base pointer className="navigation-item icon icon-me-helper-tool" />
					<Text>
						{ LocalizeText('widget.memenu.guide') }
					</Text>
				</Column> 
			}
            <Column className="me-text" gap={ 1 } alignItems="center" onClick={ event => CreateLinkEvent('achievements/toggle') }>
                <Base pointer className="navigation-item icon icon-me-achievements">
                    { (unseenAchievementCount > 0) &&
						<LayoutItemCountView count={ unseenAchievementCount } />
					}
                </Base>
                <Text>
					{ LocalizeText('widget.memenu.achievements') }
				</Text>
            </Column>
            <Column className="me-text" gap={ 1 } alignItems="center" onClick={ event => GetUserProfile(GetSessionDataManager().userId) }>
                <Base pointer className="navigation-item icon icon-me-profile" />
                <Text>
					{ LocalizeText('widget.memenu.profile') }
				</Text>
            </Column>
            <Column className="me-text" gap={ 1 } alignItems="center" onClick={ event => CreateLinkEvent('navigator/search/myworld_view') }>
                <Base pointer className="navigation-item icon icon-me-rooms" />
                <Text>
					{ LocalizeText('widget.memenu.myrooms') }
				</Text>
            </Column>
            <Column className="me-text" gap={ 1 } alignItems="center" onClick={ event => CreateLinkEvent('avatar-editor/toggle') }>
                <Base pointer className="navigation-item icon icon-me-clothing" />
                <Text>
					{ LocalizeText('widget.memenu.myclothes') }
				</Text>
            </Column>
            <Column className="me-text" gap={ 1 } alignItems="center" onClick={ event => CreateLinkEvent('forums/toggle') }>
                <Base pointer className="navigation-item icon icon-me-forums" />
                <Text>
					{ LocalizeText('widget.memenu.forums') }
				</Text>
            </Column>
            { children }
        </Flex>
    );
}
