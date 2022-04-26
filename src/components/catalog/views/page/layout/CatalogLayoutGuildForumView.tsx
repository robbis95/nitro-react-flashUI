import { CatalogGroupsComposer } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { SendMessageComposer } from '../../../../../api';
import { Base, Column, Flex, Grid, Text } from '../../../../../common';
import { useCatalog } from '../../../../../hooks';
import { CatalogFirstProductSelectorWidgetView } from '../widgets/CatalogFirstProductSelectorWidgetView';
import { CatalogGuildSelectorWidgetView } from '../widgets/CatalogGuildSelectorWidgetView';
import { CatalogPurchaseWidgetView } from '../widgets/CatalogPurchaseWidgetView';
import { CatalogTotalPriceWidget } from '../widgets/CatalogTotalPriceWidget';
import { CatalogLayoutProps } from './CatalogLayout.types';

export const CatalogLayouGuildForumView: FC<CatalogLayoutProps> = props =>
{
    const { page = null } = props;
    const [ selectedGroupIndex, setSelectedGroupIndex ] = useState<number>(0);
    const { currentOffer = null, setCurrentOffer = null, catalogOptions = null } = useCatalog();
    const { groups = null } = catalogOptions;

    useEffect(() =>
    {
        SendMessageComposer(new CatalogGroupsComposer());
    }, [ page ]);
    
    return (
        <>
            <CatalogFirstProductSelectorWidgetView />
            <Column>
                <Column className="p-1" overflow="hidden">
                    <Text className="group-forum-page" dangerouslySetInnerHTML={ { __html: page.localization.getText(1) } } />
                </Column>
                <Column overflow="hidden" gap={ 1 }>
                    { !!currentOffer &&
                        <>
                            <Column grow gap={ 0 }>
                                <Text truncate>{ currentOffer.localizationName }</Text>
                                <Base grow>
                                    <CatalogGuildSelectorWidgetView />
                                </Base>
                                <Flex justifyContent="end">
                                    <CatalogTotalPriceWidget alignItems="end" />
                                </Flex>
                                <CatalogPurchaseWidgetView noGiftOption={ true } />
                            </Column>
                        </> }
                </Column>
            </Column>
        </>
    );
}
