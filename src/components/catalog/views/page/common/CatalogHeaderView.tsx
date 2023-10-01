import { FC } from 'react';
import { ICatalogNode, LocalizeText } from '../../../../../api';
import { Column, Flex, Text } from '../../../../../common';
import { useCatalog } from '../../../../../hooks';
import { CatalogIconView } from '../../catalog-icon/CatalogIconView';

export interface CatalogHeaderViewProps
{
    node: ICatalogNode;
}

export const CatalogHeaderView: FC<CatalogHeaderViewProps> = props =>
{
    const { node = null } = props;
    const { currentPage = null, searchResult = null, rootNode = null, getNodeById = null } = useCatalog();
    
    return (
        <>
            <Flex className="catalog-header">
                <Column gap={ 0 } className="catalog-header-content">
                    { currentPage && rootNode && <CatalogIconView icon={ getNodeById(currentPage.pageId, rootNode).iconId } /> }
                    { currentPage && rootNode && <Text bold className="catalog-header-title h-100">{ !searchResult ? getNodeById(currentPage.pageId, rootNode).localization : LocalizeText('catalog.search.header') }</Text> }
                    <Text className="catalog-header-desc" dangerouslySetInnerHTML={ { __html: !searchResult ? (currentPage && currentPage.localization.getText(0)) : LocalizeText('catalog.search.results', [ 'count', 'needle' ], [ searchResult.offers.length.toString(), searchResult.searchValue ]) } }/>
                </Column>
                <Flex className="catalog-header-image" style={ { backgroundImage: `url(${ currentPage && currentPage.localization.getImage(0) })` } } />
            </Flex>
        </>
    );
}
