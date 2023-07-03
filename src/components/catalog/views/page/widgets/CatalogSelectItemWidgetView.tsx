import { FC } from 'react';
import { LocalizeText } from '../../../../../api';
import { Flex, Text } from '../../../../../common';
import { useCatalog } from '../../../../../hooks';

export const CatalogSelectItemWidgetView: FC<{}> = props =>
{
    const { currentOffer = null } = useCatalog();

    if (currentOffer) return null;

    return (
        <Flex gap={ 2 } position="absolute" className="grid-bg item-not-picker p-2 bottom-3">
            <Text bold center variant="muted" position="absolute" className="bottom-1 end-0 start-0 m-auto">{ LocalizeText('catalog.purchase.select.info') }</Text>
        </Flex>
    );
}
