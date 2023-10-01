import { FC, useEffect, useState } from 'react';
import { Base, Button, ButtonGroup, Column, Flex, Text } from '../../../../../common';
import { GiftColorButton } from '../../../../../common/GiftColorButton';
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
    const [ trophies, setTrophies ] = useState([]);
    const [ trophyColor, setTrophyColor ] = useState<string>('_g');
    const [ colors, setColors ] = useState<{ id: string, color: string }[]>([ { id: '_g', color: '#CBA200' }, { id: '_s', color: '#A2A2A2' }, { id: '_b', color: '#A25100' } ]);
    const [ lastPageTrophies, setLastPageTrophies ] = useState<number>(currentPage.pageId);

    useEffect(() =>
    {
        if (currentPage.pageId !== lastPageTrophies && currentPage.layoutCode === 'trophies')
        {
            setIndex(0);
            setTrophies([]);
            setTrophyColor('_g');
        }
        
        const trophies = currentPage.offers.filter( trophy => (trophyColor !== '_b' ? trophy.localizationId.endsWith(trophyColor) : trophy.localizationId.endsWith(trophyColor) || trophy.localizationId.endsWith(trophy.localizationId.charAt(trophy.localizationId.length - 2)) ) || (trophy.localizationId.charAt(trophy.localizationId.length - 2) !== '_' && trophy.localizationId !== '') );
        
        setTrophies(trophies)
        setCurrentOffer(trophies[index]);
        setLastPageTrophies(currentPage.pageId);
         
        setPurchaseOptions(prevValue =>
        {
            const newValue = { ...prevValue };
            newValue.extraData = trophyText;
            return newValue;
        });
    }, [ trophyText, setPurchaseOptions, currentPage.offers, setCurrentOffer, index, trophyColor, currentPage.pageId, currentPage.layoutCode, lastPageTrophies ]);

    const nextOffer = () =>
    {
        setIndex(prevValue =>
        {
            let newIndex = (prevValue + 1);

            if(newIndex >= trophies.length) newIndex = 0;

            return newIndex;
        });
    }

    const lastOffer = () =>
    {
        setIndex(prevValue =>
        {
            let newIndex = (prevValue - 1);

            if(newIndex < 0) newIndex = (trophies.length - 1);

            return newIndex;
        });
    }

    return (
        <div>
            <Column className="position-relative catalog-default-image" size={ 3 } overflow="hidden">
                <Text dangerouslySetInnerHTML={ { __html: currentPage && currentPage.localization.getText(1) } } style={ { fontSize: '12px' } }></Text>
                <Column fit overflow="hidden" className="p-2 rounded d-flex justify-content-center align-items-center">
                    <div className="position-absolute bottom-0" style={ { left: '105px' } }>
                        <Button variant="primary" className="btn btn-button btn-sm" onClick={ lastOffer }>
                            <Base className="flex-shrink-0 icon icon-chevron_left_gift" />
                        </Button>
                    </div>
                    <div className="position-absolute bottom-3">
                        <CatalogViewTrophiesWidgetView />
                    </div>
                    <div className="position-absolute bottom-0" style={ { right: '105px' } }>
                        <Button variant="primary" className="btn btn-button btn-sm" onClick={ nextOffer }>
                            <Base className="flex-shrink-0 icon icon-chevron_right_gift" />
                        </Button>
                    </div>
                </Column>
                <CatalogTotalPriceWidget className="credits-default-layout credits-bg py-1 px-2 bottom-0 end-0" justifyContent="end" alignItems="end" />
            </Column>
            <Column className="grid-bg p-2 mt-2" overflow="hidden">
                <ButtonGroup fullWidth>
                    { colors.map(color => <GiftColorButton key={ color.id } variant="dark" className="color-trophy cursor-pointer" active={ (color.id === trophyColor) } style={ { backgroundColor: color.color, borderRadius: '4px' } } onClick={ () => setTrophyColor(color.id) } />) }
                </ButtonGroup>
            </Column>
            <Column size={ 3 } position="absolute" overflow="hidden" style={ { height: 'calc(100% - 510px)', width: '64%' } }>
                <textarea className="flex-grow-1 form-control w-40 trophy-text mt-2" defaultValue={ trophyText || '' } onChange={ event => setTrophyText(event.target.value) } />
            </Column>
            <Flex gap={ 2 } position="absolute" className="purchase-buttons align-items-end bottom-3" style={ { width: '64%' } }>
                <CatalogPurchaseWidgetView />
            </Flex>

        </div>
    );
}
