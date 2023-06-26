import { DesktopViewEvent, GetGuestRoomResultEvent, GroupInformationComposer, GroupInformationEvent, GroupInformationParser, GroupRemoveMemberComposer, HabboGroupDeactivatedMessageEvent, RoomEntryInfoMessageEvent } from '@nitrots/nitro-renderer';
import { FC, useState } from 'react';
import { GetGroupInformation, GetGroupManager, GetSessionDataManager, GroupMembershipType, GroupType, LocalizeText, SendMessageComposer, TryJoinGroup } from '../../../api';
import { Base, Button, Column, Flex, LayoutBadgeImageView, Text } from '../../../common';
import { useMessageEvent, useNotification } from '../../../hooks';

export const GroupRoomInformationView: FC<{}> = props =>
{
    const [ expectedGroupId, setExpectedGroupId ] = useState<number>(0);
    const [ groupInformation, setGroupInformation ] = useState<GroupInformationParser>(null);
    const [ isOpen, setIsOpen ] = useState<boolean>(true);
    const { showConfirm = null } = useNotification();

    useMessageEvent<DesktopViewEvent>(DesktopViewEvent, event =>
    {
        setExpectedGroupId(0);
        setGroupInformation(null);
    });

    useMessageEvent<RoomEntryInfoMessageEvent>(RoomEntryInfoMessageEvent, event =>
    {
        setExpectedGroupId(0);
        setGroupInformation(null);
    });

    useMessageEvent<GetGuestRoomResultEvent>(GetGuestRoomResultEvent, event =>
    {
        const parser = event.getParser();

        if(!parser.roomEnter) return;

        if(parser.data.habboGroupId > 0)
        {
            setExpectedGroupId(parser.data.habboGroupId);
            SendMessageComposer(new GroupInformationComposer(parser.data.habboGroupId, false));
        }
        else
        {
            setExpectedGroupId(0);
            setGroupInformation(null);
        }
    });

    useMessageEvent<HabboGroupDeactivatedMessageEvent>(HabboGroupDeactivatedMessageEvent, event =>
    {
        const parser = event.getParser();

        if(!groupInformation || ((parser.groupId !== groupInformation.id) && (parser.groupId !== expectedGroupId))) return;

        setExpectedGroupId(0);
        setGroupInformation(null);
    });

    useMessageEvent<GroupInformationEvent>(GroupInformationEvent, event =>
    {
        const parser = event.getParser();

        if(parser.id !== expectedGroupId) return;

        setGroupInformation(parser);
    });

    const leaveGroup = () =>
    {
        showConfirm(LocalizeText('group.leaveconfirm.desc'), () =>
        {
            SendMessageComposer(new GroupRemoveMemberComposer(groupInformation.id, GetSessionDataManager().userId));
        }, null);
    }

    const isRealOwner = (groupInformation && (groupInformation.ownerName === GetSessionDataManager().userName));

    const getButtonText = () =>
    {
        if(isRealOwner) return 'group.manage';

        if(groupInformation.type === GroupType.PRIVATE) return '';

        if(groupInformation.membershipType === GroupMembershipType.MEMBER) return 'group.leave';

        if((groupInformation.membershipType === GroupMembershipType.NOT_MEMBER) && groupInformation.type === GroupType.REGULAR) return 'group.join';

        if(groupInformation.membershipType === GroupMembershipType.REQUEST_PENDING) return 'group.membershippending';

        if((groupInformation.membershipType === GroupMembershipType.NOT_MEMBER) && groupInformation.type === GroupType.EXCLUSIVE) return 'group.requestmembership';
    }

    const handleButtonClick = () =>
    {
        if(isRealOwner) return GetGroupManager(groupInformation.id);

        if((groupInformation.type === GroupType.PRIVATE) && (groupInformation.membershipType === GroupMembershipType.NOT_MEMBER)) return;

        if(groupInformation.membershipType === GroupMembershipType.MEMBER)
        {
            leaveGroup();

            return;
        }

        TryJoinGroup(groupInformation.id);
    }

    if(!groupInformation) return null;

    return (
        <Base className="nitro-notification-bubble">
            <Column>
                <Flex className="grouproom-header" alignItems="center" justifyContent="between" pointer onClick={ event => setIsOpen(value => !value) }>
                    <Flex className="icon-style">
                        <Base className="icon icon-group_icon_room" />
                    </Flex>
                    <Text bold variant="white" overflow="hidden">{ LocalizeText('group.homeroominfo.title') }</Text>
                    <Flex className="arrow-right-style">
                        { isOpen && <Base className="icon icon-notification_arrow_down" /> }
                        { !isOpen && <Base className="icon icon-notification_arrow_left" /> }
                    </Flex>
                </Flex>
                { isOpen &&
                    <>
                        <Column className="px-2 pb-2">
                            <Flex pointer alignItems="center" gap={ 2 } onClick={ event => GetGroupInformation(groupInformation.id) }>
                                <Base className="group-badge">
                                    <LayoutBadgeImageView badgeCode={ groupInformation.badge } isGroup={ true } />
                                </Base>
                                <Text bold variant="white">{ groupInformation.title }</Text>
                            </Flex>
                            { (groupInformation.type !== GroupType.PRIVATE || isRealOwner) &&
                            <Button fullWidth className="btn-flash fw-bold" disabled={ (groupInformation.membershipType === GroupMembershipType.REQUEST_PENDING) } onClick={ handleButtonClick }>
                                { LocalizeText(getButtonText()) }
                            </Button>
                            }
                        </Column>
                    </> }
            </Column>
        </Base>
    );
};
