import { FC } from 'react';
import { CreateLinkEvent, LocalizeText } from '../../../../../api';
import { Base } from '../../../../../common/Base';
import { Button } from '../../../../../common/Button';
import { Column } from '../../../../../common/Column';
import { Grid } from '../../../../../common/Grid';
import { Text } from '../../../../../common';
import { LayoutImage } from '../../../../../common/layout/LayoutImage';
import { CatalogLayoutProps } from './CatalogLayout.types';

export const CatalogLayouGuildFrontpageView: FC<CatalogLayoutProps> = props =>
{
    const { page = null } = props;
    
    return (
        <Column>
            <Column gap={ 4 } overflow="hidden" className="p-3">
                <Text bold dangerouslySetInnerHTML={ { __html: page.localization.getText(2) } } />
                <Text overflow="auto" dangerouslySetInnerHTML={ { __html: page.localization.getText(0) } } />
                <Text dangerouslySetInnerHTML={ { __html: page.localization.getText(1) } } />
            </Column>
            <Column center size={ 5 } overflow="hidden">
                <LayoutImage imageUrl={ page.localization.getImage(1) } />
                <Button onClick={ () => CreateLinkEvent('groups/create') }>
                    { LocalizeText('catalog.start.guild.purchase.button') }
                </Button>
            </Column>
        </Column>
    );
}
