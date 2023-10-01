export const getTypePrice = (type: string) =>
{
    const priceState = {
        'price_type_none'                       : 'grid-bg',
        'price_type_credits'                    : 'credits-bg',
        'price_type_activitypoints'             : 'duckets-bg',
        'price_type_credits_and_activitypoints' : 'grid-bg'
    };

    return priceState[type];
}
