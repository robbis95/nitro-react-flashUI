import { Dispose, DropBounce, EaseOut, JumpBy, Motions, NitroToolbarAnimateIconEvent, PerkAllowancesMessageEvent, PerkEnum, Queue, Wait } from '@nitrots/nitro-renderer';
import { FC, useState } from 'react';
import { CreateLinkEvent, GetConfiguration, GetSessionDataManager, LocalizeText, MessengerIconState, OpenMessengerChat, VisitDesktop } from '../../api';
import { Base, Flex, LayoutAvatarImageView, LayoutItemCountView, TransitionAnimation, TransitionAnimationTypes } from '../../common';
import { useAchievements, useFriends, useInventoryUnseenTracker, useMessageEvent, useMessenger, useRoomEngineEvent, useSessionInfo } from '../../hooks';
import { ToolbarMeView } from './ToolbarMeView';

export const ToolbarView: FC<{ isInRoom: boolean }> = props =>
{
    const { isInRoom } = props;
    const [ isMeExpanded, setMeExpanded ] = useState(false);
    const [ leftSideCollapsed, setLeftSideCollapsed ] = useState(true);
    const [ rightSideCollapsed, setRightSideCollapsed ] = useState(true);
    const [ useGuideTool, setUseGuideTool ] = useState(false);
    const { userFigure = null } = useSessionInfo();
    const { getFullCount = 0 } = useInventoryUnseenTracker();
    const { getTotalUnseen = 0 } = useAchievements();
    const { requests = [] } = useFriends();
    const { iconState = MessengerIconState.HIDDEN } = useMessenger();
    const isMod = GetSessionDataManager().isModerator;

    useMessageEvent<PerkAllowancesMessageEvent>(PerkAllowancesMessageEvent, event =>
    {
        const parser = event.getParser();

        setUseGuideTool(parser.isAllowed(PerkEnum.USE_GUIDE_TOOL));
    });

    useRoomEngineEvent<NitroToolbarAnimateIconEvent>(NitroToolbarAnimateIconEvent.ANIMATE_ICON, event =>
    {
        const animationIconToToolbar = (iconName: string, image: HTMLImageElement, x: number, y: number) =>
        {
            const target = (document.body.getElementsByClassName(iconName)[0] as HTMLElement);

            if(!target) return;

            image.className = 'toolbar-icon-animation';
            image.style.visibility = 'visible';
            image.style.left = (x + 'px');
            image.style.top = (y + 'px');

            document.body.append(image);

            const targetBounds = target.getBoundingClientRect();
            const imageBounds = image.getBoundingClientRect();

            const left = (imageBounds.x - targetBounds.x);
            const top = (imageBounds.y - targetBounds.y);
            const squared = Math.sqrt(((left * left) + (top * top)));
            const wait = (500 - Math.abs(((((1 / squared) * 100) * 500) * 0.5)));
            const height = 20;

            const motionName = (`ToolbarBouncing[${ iconName }]`);

            if(!Motions.getMotionByTag(motionName))
            {
                Motions.runMotion(new Queue(new Wait((wait + 8)), new DropBounce(target, 400, 12))).tag = motionName;
            }

            const motion = new Queue(new EaseOut(new JumpBy(image, wait, ((targetBounds.x - imageBounds.x) + height), (targetBounds.y - imageBounds.y), 100, 1), 1), new Dispose(image));

            Motions.runMotion(motion);
        }

        animationIconToToolbar('icon-inventory', event.image, event.x, event.y);
    });

    return (
        <>
            <TransitionAnimation type={ TransitionAnimationTypes.FADE_IN } inProp={ isMeExpanded } timeout={ 300 }>
                <ToolbarMeView useGuideTool={ useGuideTool } unseenAchievementCount={ getTotalUnseen } setMeExpanded={ setMeExpanded } />
            </TransitionAnimation>
            <Flex alignItems="center" justifyContent="center" id="toolbar-chat-input-container" />
            <Flex alignItems="center" justifyContent="between" gap={ 2 } className="nitro-toolbar py-1 px-3">
                <button className={ leftSideCollapsed ? 'toolbar-left-collapse' : 'toolbar-left-collapse-active' } onClick={ () => setLeftSideCollapsed((collapsed) => !collapsed) }/>
                <Flex gap={ 2 } alignItems="center" className="toolbar-left-side">
                    <Flex alignItems="center" gap={ 2 }>
                        { leftSideCollapsed &&
                        <Flex gap={ 2 }>
                            { isInRoom &&
                            <Base pointer className="navigation-item icon icon-habbo" title={ LocalizeText('toolbar.icon.tooltip.exitroom.hotelview') } onClick={ event => VisitDesktop() } /> }
                            { !isInRoom &&
                            <Base pointer className="navigation-item icon icon-house" title={ LocalizeText('toolbar.icon.tooltip.exitroom.home') } onClick={ event => CreateLinkEvent('navigator/goto/home') } /> }
                            <Base pointer className="navigation-item icon icon-rooms" title={ LocalizeText('toolbar.icon.label.navigator') } onClick={ event => CreateLinkEvent('navigator/toggle') } />
                            { GetConfiguration('game.center.enabled') && <Base pointer className="navigation-item icon icon-game" title={ LocalizeText('toolbar.icon.label.games') } onClick={ event => CreateLinkEvent('games/toggle') } /> }
                        </Flex> }
                        <Base pointer className="navigation-item icon icon-catalog" title={ LocalizeText('tooltip.shop') } onClick={ event => CreateLinkEvent('catalog/toggle') } />
                        <Base pointer className="navigation-item icon icon-inventory" title={ LocalizeText('toolbar.icon.label.inventory') } onClick={ event => CreateLinkEvent('inventory/toggle') }>
                            { (getFullCount > 0) &&
                                <LayoutItemCountView count={ getFullCount } /> }
                        </Base>
                        <Flex center pointer className={ 'navigation-item item-avatar ' + (isMeExpanded ? 'active ' : '') } title={ LocalizeText('toolbar.icon.label.memenu') } onClick={ event => setMeExpanded(!isMeExpanded) }>
                            <LayoutAvatarImageView figure={ userFigure } direction={ 2 } position="absolute" />
                            { (getTotalUnseen > 0) &&
                                <LayoutItemCountView count={ getTotalUnseen } /> }
                        </Flex>
                        { isInRoom &&
                            <Base pointer className="navigation-item icon icon-camera" title={ LocalizeText('camera.interface.title') } onClick={ event => CreateLinkEvent('camera/toggle') } /> }
                        { isMod &&
                            <Base pointer className="navigation-item icon icon-modtools" onClick={ event => CreateLinkEvent('mod-tools/toggle') } /> }
                    </Flex>
                </Flex>
                <Flex alignItems="center" gap={ 2 } className={ rightSideCollapsed ? 'toolbar-right-side' : '' }>
                    <Flex gap={ 2 } className={ ((iconState === MessengerIconState.SHOW) || (iconState === MessengerIconState.UNREAD)) ? '' : 'margin-friends' }>
                        <Base pointer className="navigation-item icon icon-friendall" title={ LocalizeText('friend.bar.friends.title') } onClick={ event => CreateLinkEvent('friends/toggle') }>
                            { (requests.length > 0) &&
                                <LayoutItemCountView count={ requests.length } /> }
                        </Base>
                        <Base pointer className="navigation-item icon icon-friendsearch" title={ LocalizeText('friendlist.tip.search') } onClick={ event => CreateLinkEvent('friends/search') }></Base>
                        { ((iconState === MessengerIconState.SHOW) || (iconState === MessengerIconState.UNREAD)) &&
                            <Base pointer className={ `navigation-item icon icon-message ${ (iconState === MessengerIconState.UNREAD) && 'is-unseen' }` } onClick={ event => OpenMessengerChat() } /> }
                    </Flex>
                    <Base id="toolbar-friend-bar-container" className={ rightSideCollapsed ? 'd-none d-lg-block' : 'd-none' } />
                </Flex>
                <button className={ rightSideCollapsed ? 'toolbar-right-collapse' : 'toolbar-right-collapse-active' } onClick={ () => setRightSideCollapsed((collapsed) => !collapsed) }/>
            </Flex>
        </>
    );
}
