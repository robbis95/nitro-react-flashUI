import { FC, useMemo } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { LocalizeFormattedNumber, LocalizeShortNumber } from '../../../api';
import { Flex, LayoutCurrencyIcon, Text } from '../../../common';

interface CurrencyViewProps
{
    type: number;
    amount: number;
    short: boolean;
}

export const CurrencyView: FC<CurrencyViewProps> = props =>
{
    const { type = -1, amount = -1, short = false } = props;

    const element = useMemo(() =>
    {
        return (
            <Flex justifyContent="end" pointer gap={ 1 } className="nitro-purse-button rounded">
                <Text bold truncate textEnd variant="white" grow title={ LocalizeFormattedNumber(amount) }>{ short ? LocalizeShortNumber(amount) : LocalizeFormattedNumber(amount) }</Text>
                <LayoutCurrencyIcon type={ type } />
            </Flex>);
    }, [ amount, short, type ]);

    return element;
}
