import { FC } from 'react';
import { LocalizeText, NotificationBubbleItem, NotificationUtilities } from '../../../../api';
import { LayoutCurrencyIcon, LayoutNotificationBubbleView, LayoutNotificationBubbleViewProps } from '../../../../common';

export interface NotificationClubGiftBubbleViewProps extends LayoutNotificationBubbleViewProps
{
    item: NotificationBubbleItem;
}

export const NotificationClubGiftBubbleView: FC<NotificationClubGiftBubbleViewProps> = props =>
{
    const { item = null, close = null, ...rest } = props;

    return (
        <LayoutNotificationBubbleView fadesOut={ false } className="flex-column nitro-notification club-gift" close={ close } { ...rest }>
            <div className="d-flex gap-1 mb-2">
                <LayoutCurrencyIcon type="hc" className="flex-shrink-0" />
                <span className="ms-1">{ LocalizeText('notifications.text.club_gift') }</span>
            </div>
            <div className="d-flex align-items-center justify-content-end gap-2">
            <span className="text-decoration-underline cursor-pointer text-nowrap notification-text-link" onClick={ close }>{ LocalizeText('notifications.button.later') }</span>
                <button type="button" className="btn btn-primary notification-buttons w-100" onClick={ () => NotificationUtilities.openUrl(item.linkUrl) }>{ LocalizeText('notifications.button.show_gift_list') }</button>
            </div>
        </LayoutNotificationBubbleView>
    );
}
