import { FC } from 'react';
import { LocalizeText, NotificationBubbleItem, OpenUrl } from '../../../../api';
import { Base, LayoutNotificationBubbleView, LayoutNotificationBubbleViewProps } from '../../../../common';

export interface NotificationClubGiftBubbleViewProps extends LayoutNotificationBubbleViewProps
{
    item: NotificationBubbleItem;
}

export const NotificationClubGiftBubbleView: FC<NotificationClubGiftBubbleViewProps> = props =>
{
    const { item = null, onClose = null, ...rest } = props;

    return (
        <LayoutNotificationBubbleView fadesOut={ false } className="flex-column nitro-notification club-gift" onClose={ onClose } { ...rest }>
            <div className="d-flex gap-1 mb-2">
                <Base className="flex-shrink-0 icon icon-hc_gift_monthly mt-1" />
                <span className="ms-1">{ LocalizeText('notifications.text.club_gift') }</span>
            </div>
            <div className="d-flex align-items-center justify-content-between">
                <span className="text-decoration-underline cursor-pointer text-nowrap" onClick={ onClose }>{ LocalizeText('notifications.button.later') }</span>
                <button type="button" className="btn btn-gray gray-button" onClick={ () => OpenUrl(item.linkUrl) }>{ LocalizeText('notifications.button.show_gift_list') }</button>
            </div>
        </LayoutNotificationBubbleView>
    );
}
