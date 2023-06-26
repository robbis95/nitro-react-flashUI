import { RoomObjectCategory } from '@nitrots/nitro-renderer';
import { Dispatch, FC, SetStateAction } from 'react';
import { GetUserProfile, LocalizeText } from '../../../../../api';
import { ContextMenuHeaderView } from '../../context-menu/ContextMenuHeaderView';
import { ContextMenuListItemView } from '../../context-menu/ContextMenuListItemView';
import { ContextMenuListView } from '../../context-menu/ContextMenuListView';
import { ContextMenuView } from '../../context-menu/ContextMenuView';

interface AvatarInfoWidgetDecorateViewProps
{
    userId: number;
    userName: string;
    roomIndex: number;
    setIsDecorating: Dispatch<SetStateAction<boolean>>;
}

export const AvatarInfoWidgetDecorateView: FC<AvatarInfoWidgetDecorateViewProps> = props =>
{
    const { userId = -1, userName = '', roomIndex = -1, setIsDecorating = null } = props;
    
    return (
        <ContextMenuView className="mt-4" objectId={ roomIndex } category={ RoomObjectCategory.UNIT } collapsable={ true } onClose={ null }>
            <ContextMenuHeaderView className="cursor-pointer" title={ LocalizeText('guide.help.common.profile.tooltip') } onClick={ event => GetUserProfile(userId) }>
                { userName }
            </ContextMenuHeaderView>
            <ContextMenuListView>
                <ContextMenuListItemView onClick={ event => setIsDecorating(false) }>
                    { LocalizeText('widget.avatar.stop_decorating') }
                </ContextMenuListItemView>
            </ContextMenuListView>
        </ContextMenuView>
    )
}
