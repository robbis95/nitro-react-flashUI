import { FC, useEffect, useRef, useState } from 'react';
import { AutoGrid, Base, Button, Column, Flex, Text } from '../../../../../common';
import { useCatalog } from '../../../../../hooks';
import { CatalogPurchaseWidgetView } from '../widgets/CatalogPurchaseWidgetView';
import { CatalogTotalPriceWidget } from '../widgets/CatalogTotalPriceWidget';
import { CatalogViewTrophiesWidgetView } from '../widgets/CatalogViewTrophiesWidgetView';
import { CatalogLayoutProps } from './CatalogLayout.types';

export const CatalogLayoutTrophiesView: FC<CatalogLayoutProps> = props =>
{
    const [ trophyText, setTrophyText ] = useState<string>('');
    const { setCurrentOffer = null, setPurchaseOptions = null, currentPage = null } = useCatalog();
    const [ index, setIndex ] = useState(0);
    const elementRef = useRef<HTMLDivElement>();
    const [ trophies, setTrophies ] = useState([]);
    const [ qtdOffers, setQtdOffers ] = useState(0)
    
    useEffect(() =>
    {  
        if (currentPage.offers.length !== qtdOffers)
        {
            setTrophies([]);
            setIndex(0);
        }
        if(trophies.length === 0) 
        {
            // Set the total offers from trophies catalog
            setQtdOffers(currentPage.offers.length)
            // Default : Gold Trophie and uniques (Staff)
            const trophies = currentPage.offers.filter((trophy) => trophy.localizationId.includes('_g') || !trophy.localizationId.match(/[_gsb]/));
            setCurrentOffer(trophies[index]);
            setTrophies(trophies)
        } 
        setPurchaseOptions(prevValue =>
        {
            const newValue = { ...prevValue };
            newValue.extraData = trophyText;
            return newValue;
        });
    }, [ trophies, index, currentPage, trophyText, qtdOffers, setCurrentOffer, setPurchaseOptions, setQtdOffers ]);


    const setTrophyColor = (color: string) =>  
    {
        //Set color to the selected Trophie (_g = gold, _s = silver, _b = bronze)
        const trophies = currentPage.offers.filter((trophy) => trophy.localizationId.includes(color));
        setTrophies(trophies)
        setCurrentOffer(trophies[index]);
    }

    const lastOffer = () =>
    {
        setIndex(prevIndex => prevIndex - 1);
        if(index <= 0)
        {
            setIndex(0);
            setCurrentOffer(trophies[index]);
        }
        else 
        {
            setCurrentOffer(trophies[index - 1]);
        }
    }

    const nextOffer = () =>
    {
        setIndex(prevIndex => prevIndex + 1);
        if(index >= trophies.length - 1) 
        {
            setIndex(0);
            setCurrentOffer(trophies[0]);
        }
        else 
        {
            setCurrentOffer(trophies[index + 1]);
        }
    }

    return (
        <div>
            <Column className="position-relative catalog-default-image" size={ 3 } overflow="hidden">
                <Text dangerouslySetInnerHTML={ { __html: currentPage && currentPage.localization.getText(1) } } style={ { fontSize: '12px' } }></Text>
                <Column fit overflow="hidden" className="p-2 rounded d-flex justify-content-center align-items-center">
                    <div className="position-absolute bottom-0" style={ { left: '105px' } }>
                        <Button variant="primary" className="volter-button btn-sm" onClick={ lastOffer }>
                            <Base className="flex-shrink-0 icon icon-chevron_left_gift" />
                        </Button>
                    </div>
                    <div className="position-absolute bottom-0" style={ { top: '150px' } }>
                        <CatalogViewTrophiesWidgetView />
                    </div>
                    <div className="position-absolute bottom-0" style={ { right: '105px' } }>
                        <Button variant="primary" className="volter-button btn-sm" onClick={ nextOffer }>
                            <Base className="flex-shrink-0 icon icon-chevron_right_gift" />
                        </Button>
                    </div>
                </Column>
                <CatalogTotalPriceWidget className="credits-default-layout credits-bg py-1 px-2 bottom-1 end-1" justifyContent="end" alignItems="end" />
            </Column>
            <Column className="grid-bg w-10 h-10 p-2 mt-2 flex" size={ 3 } overflow="hidden" gap={ 2 }>
                <AutoGrid innerRef={ elementRef } columnCount={ 5 } >
                    <Column className="catalog-grid-active cursor-pointer" gap={ 0 }>
                        <Base fit className="unique-bg-override" />
                        <div className="border border-2 border-white" style={ { backgroundColor: '#CBA200' } } onClick={ () => setTrophyColor('_g') } >
                            <i className="mr-1 d-inline-block outline" />
                        </div>
                    </Column>
                    <Column className="catalog-grid-active cursor-pointer" gap={ 0 }>
                        <Base fit className="unique-bg-override" />
                        <div className="border border-2 border-white" style={ { backgroundColor: '#A2A2A2' } } onClick={ () => setTrophyColor('_s') } >
                            <i className="mr-1 d-inline-block outline" />
                        </div>
                    </Column>
                    <Column className="catalog-grid-active cursor-pointer" gap={ 0 }>
                        <Base fit className="unique-bg-override"/>
                        <div className="border border-2 border-white" style={ { backgroundColor: '#A25100' } } onClick={ () => setTrophyColor('_b') } >
                            <i className="mr-1 d-inline-block outline" />
                        </div>
                    </Column>
                </AutoGrid>
            </Column>
            <Column size={ 3 } overflow="hidden">
                <textarea className="flex-grow-1 form-control w-40 trophy-text mt-2" defaultValue={ trophyText || '' } onChange={ event => setTrophyText(event.target.value) } />
            </Column>
            <Flex gap={ 2 } className="purchase-buttons align-items-end mt-2">
                <CatalogPurchaseWidgetView />
            </Flex>

        </div>
    );
}
