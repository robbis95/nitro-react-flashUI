import { FC, useCallback, useEffect, useState } from 'react';
import { IMarketplaceSearchOptions, LocalizeText, MarketplaceSearchType } from '../../../../../../api';
import { Button, Column, Flex, Text } from '../../../../../../common';

export interface SearchFormViewProps
{
    searchType: number;
    sortTypes: number[];
    onSearch(options: IMarketplaceSearchOptions): void;
}

export const SearchFormView: FC<SearchFormViewProps> = props =>
{
    const { searchType = null, sortTypes = null, onSearch = null } = props;
    const [ sortType, setSortType ] = useState(sortTypes ? sortTypes[0] : 3); // first item of SORT_TYPES_ACTIVITY
    const [ searchQuery, setSearchQuery ] = useState('');
    const [ min, setMin ] = useState(0);
    const [ max, setMax ] = useState(0);
    
    const onSortTypeChange = useCallback((sortType: number) =>
    {
        setSortType(sortType);

        if((searchType === MarketplaceSearchType.BY_ACTIVITY) || (searchType === MarketplaceSearchType.BY_VALUE)) onSearch({ minPrice: -1, maxPrice: -1, query: '', type: sortType });
    }, [ onSearch, searchType ]);

    const onClickSearch = useCallback(() =>
    {
        const minPrice = ((min > 0) ? min : -1);
        const maxPrice = ((max > 0) ? max : -1);

        onSearch({ minPrice: minPrice, maxPrice: maxPrice, type: sortType, query: searchQuery })
    }, [ max, min, onSearch, searchQuery, sortType ]);

    useEffect( () => 
    {
        if(!sortTypes || !sortTypes.length) return;
        
        const sortType = sortTypes[0];

        setSortType(sortType);

        if(searchType === MarketplaceSearchType.ADVANCED) (setSearchQuery(''), setMin(0), setMax(0));
        if(searchType === MarketplaceSearchType.BY_ACTIVITY || MarketplaceSearchType.BY_VALUE === searchType) onSearch({ minPrice: -1, maxPrice: -1, query: '', type: sortType });
    }, [ onSearch, searchType, sortTypes ]);

    return (
        <Column gap={ 1 } className="marketplace-bg search-marketplace">
            { searchType !== MarketplaceSearchType.ADVANCED &&
                <Column className="mt-4" justifyContent="center" alignItems="center">
                    <Text variant="muted" className="font-size-marketplace">{ LocalizeText('catalog.marketplace.sort_order') }</Text>
                    <select className="form-select form-select-sm w-50" value={ sortType } onChange={ event => onSortTypeChange(parseInt(event.target.value)) }>
                        { sortTypes.map(type => <option key={ type } value={ type }>{ LocalizeText(`catalog.marketplace.sort.${ type }`) }</option>) }
                    </select>
                </Column>
            }
            { searchType === MarketplaceSearchType.ADVANCED &&
                <>
                    <Column gap={ 1 } className="mt-1 px-2">
                        <Flex alignItems="center">
                            <Text variant="muted" className="col-4 font-size-marketplace">{ LocalizeText('catalog.marketplace.search_name') }</Text>
                            <input className="form-control form-control-sm" type="text" value={ searchQuery } onChange={ event => setSearchQuery(event.target.value) }/>
                        </Flex>
                        <Flex alignItems="center">
                            <Text variant="muted" className="col-4 font-size-marketplace">{ LocalizeText('catalog.marketplace.search_price') }</Text>
                            <Flex justifyContent="center">
                                <Flex justifyContent="start">
                                    <input className="form-control form-control-sm w-75" type="number" min={ 0 } value={ min } onChange={ event => setMin(event.target.valueAsNumber) } />
                                </Flex>
                                <Flex justifyContent="end">
                                    <input className="form-control form-control-sm w-75" type="number" min={ 0 } value={ max } onChange={ event => setMax(event.target.valueAsNumber) } />
                                </Flex>
                            </Flex>
                        </Flex>
                        <Flex alignItems="center">
                            <Text variant="muted" className="col-4 font-size-marketplace">{ LocalizeText('catalog.marketplace.sort_order') }</Text>
                            <select className="form-select form-select-sm w-100" value={ sortType } onChange={ event => onSortTypeChange(parseInt(event.target.value)) }>
                                { sortTypes.map(type => <option key={ type } value={ type }>{ LocalizeText(`catalog.marketplace.sort.${ type }`) }</option>) }
                            </select>
                        </Flex>
                        <Flex justifyContent="end">
                            <Button variant="secondary" className="w-25 h-25" onClick={ onClickSearch }>{ LocalizeText('generic.search') }</Button>
                        </Flex>
                    </Column>
                </>
            }
        </Column>
    );
}
