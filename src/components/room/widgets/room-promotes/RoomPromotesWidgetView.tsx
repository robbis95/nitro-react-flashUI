import { DesktopViewEvent } from '@nitrots/nitro-renderer';
import { FC, useState } from 'react';
import { CreateLinkEvent, GetSessionDataManager, LocalizeText } from '../../../../api';
import { Base, Column, Flex, Text } from '../../../../common';
import { useMessageEvent, useNavigator, useRoomPromote } from '../../../../hooks';
import { RoomPromoteEditWidgetView, RoomPromoteMyOwnEventWidgetView, RoomPromoteOtherEventWidgetView } from './views';

export const RoomPromotesWidgetView: FC<{}> = props =>
{
    const [ isEditingPromote, setIsEditingPromote ] = useState<boolean>(false);
    const [ isOpen, setIsOpen ] = useState<boolean>(true);
    const { promoteInformation, setPromoteInformation } = useRoomPromote();
    const { navigatorData } = useNavigator();

    useMessageEvent<DesktopViewEvent>(DesktopViewEvent, event =>
    {
        setPromoteInformation(null);
    });

    if(!promoteInformation) return null;

    return (
        <>
            { (promoteInformation?.data.adId === -1 && navigatorData?.enteredGuestRoom?.ownerId === GetSessionDataManager().userId) &&
                <Base className="nitro-notification-bubble">
                    <Column>
                        <Flex className="grouproom-header" alignItems="center" justifyContent="between" pointer onClick={ event => CreateLinkEvent('catalog/open/room_event') }>
                            <Flex className="icon-style">
                                <Base className="icon icon-room-promote" />
                            </Flex>
                            <Text bold underline className="text-no-promote">{ LocalizeText('roomad.get.event') }</Text>
                            <Flex className="arrow-right-style">
                                <Base className="icon icon-notification_arrow_left" />
                            </Flex>
                        </Flex>
                    </Column>
                </Base>
            }
            { promoteInformation.data.adId !== -1 &&
                <Base className="nitro-notification-bubble">
                    <Column>
                        <Flex className="grouproom-header" alignItems="center" justifyContent="between" pointer onClick={ event => setIsOpen(value => !value) }>
                            <Flex className="icon-style">
                                <Base className="icon icon-room-promote" />
                            </Flex>
                            <Text bold variant="white" overflow="hidden">{ promoteInformation.data.eventName }</Text>
                            <Flex className="arrow-right-style">
                                { isOpen && <Base className="icon icon-notification_arrow_down" /> }
                                { !isOpen && <Base className="icon icon-notification_arrow_left" /> }
                            </Flex>
                        </Flex>
                        { (isOpen && GetSessionDataManager().userId !== promoteInformation.data.ownerAvatarId) &&
                            <RoomPromoteOtherEventWidgetView
                                eventDescription={ promoteInformation.data.eventDescription }
                            />
                        }
                        { (isOpen && GetSessionDataManager().userId === promoteInformation.data.ownerAvatarId) &&
                            <RoomPromoteMyOwnEventWidgetView
                                eventDescription={ promoteInformation.data.eventDescription }
                                setIsEditingPromote={ () => setIsEditingPromote(true) }
                            />
                        }
                        { isEditingPromote &&
                            <RoomPromoteEditWidgetView
                                eventId={ promoteInformation.data.adId }
                                eventName={ promoteInformation.data.eventName }
                                eventDescription={ promoteInformation.data.eventDescription }
                                setIsEditingPromote={ () => setIsEditingPromote(false) }
                            />
                        }
                    </Column>
                </Base>
            }
        </>
    );
};
