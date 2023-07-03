import { ChangeEvent, FC, useState } from 'react';
import { LocalizeText } from '../../../../../api';
import { Flex, Text } from '../../../../../common';
import { useCatalog } from '../../../../../hooks';

const MIN_VALUE: number = 1;
const MAX_VALUE: number = 100;

export const CatalogSpinnerWidgetView: FC<{}> = props =>
{
    const [ quantityInput, setQuantityInput ] = useState<string>('1');
    const { currentOffer = null, purchaseOptions = null, setPurchaseOptions = null } = useCatalog();
    const { quantity = 1 } = purchaseOptions;

    const updateQuantity = (value: string | number) =>
    {
        value = Math.max(Number(value), MIN_VALUE);
        value = Math.min(Number(value), MAX_VALUE);

        if(Number(value) === quantity) return;

        setPurchaseOptions(prevValue =>
        {
            const newValue = { ...prevValue };

            newValue.quantity = !value ? MIN_VALUE : Number(value);

            return newValue;
        });
    }

    const changeQuantity = (event: ChangeEvent<HTMLInputElement>) =>
    {
        const value = event.target.value;

        setQuantityInput(Number(value) > 100 ? MAX_VALUE.toString() : value);
        updateQuantity(value);
    }

    if(!currentOffer || !currentOffer.bundlePurchaseAllowed) return null;

    return (
        <>
            <Text variant="muted" className="mt-1">{ LocalizeText('catalog.bundlewidget.quantity') }</Text>
            <Flex alignItems="center" gap={ 1 }>
                <input type="number" className="form-control form-control-sm quantity-input mt-2 ms-2" value={ quantityInput } onChange={ changeQuantity } />
            </Flex>
        </>
    );
}
