import { FC, useCallback, useEffect, useState } from 'react';
import { LayoutCurrencyIcon, LayoutGridItem, LayoutGridItemProps } from '../../../../common';
import { LayoutGridColorPickerItem } from '../../../../common/layout/LayoutGridColorPickerItem';
import { AvatarEditorGridColorItem } from '../../common/AvatarEditorGridColorItem';

export interface AvatarEditorPaletteSetItemProps extends LayoutGridItemProps
{
    colorItem: AvatarEditorGridColorItem;
}

export const AvatarEditorPaletteSetItem: FC<AvatarEditorPaletteSetItemProps> = props =>
{
    const { colorItem = null, children = null, ...rest } = props;
    const [ updateId, setUpdateId ] = useState(-1);

    const rerender = useCallback(() =>
    {
        setUpdateId(prevValue => (prevValue + 1));
    }, []);

    useEffect(() =>
    {
        colorItem.notify = rerender;

        return () => colorItem.notify = null;
    });

    return (
        <LayoutGridColorPickerItem itemHighlight itemColor={ colorItem.color } itemActive={ colorItem.isSelected } className="color-picker-frame clear-bg" { ...rest }>
            { colorItem.isHC && <i className="icon hc-icon position-absolute" /> }
            { children }
        </LayoutGridColorPickerItem>
    );
}
