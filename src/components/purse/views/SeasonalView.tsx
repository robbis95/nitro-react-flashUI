import { FC } from 'react';
import { LocalizeFormattedNumber, LocalizeText } from '../../../api';
import { Flex, LayoutCurrencyIcon, Text } from '../../../common';

interface SeasonalViewProps
{
    type: number;
    amount: number;
}

export const SeasonalView: FC<SeasonalViewProps> = props =>
{
    const { type = -1, amount = -1 } = props;

    return (
        <Flex fullWidth justifyContent="between" className="nitro-purse-seasonal-currency nitro-notification position-relative">
            <Flex fullWidth>
                <Text bold truncate fullWidth className="seasonal-padding seasonal-bold">{ LocalizeText(`purse.seasonal.currency.${ type }`) }</Text>
                <Text bold variant="white" className="seasonal-padding">{ LocalizeFormattedNumber(amount) }</Text>
                <Flex className="nitro-seasonal-box seasonal-padding">
                    <LayoutCurrencyIcon type={ type } />
                </Flex>        
            </Flex>            
        </Flex>

    );
}
