import { FC, useMemo } from 'react';
import { Flex, FlexProps } from './Flex';
import { ButtonSizeType, ColorVariantType } from './types';

export interface ButtonModtoolProps extends FlexProps
{
    variant?: ColorVariantType;
    size?: ButtonSizeType;
    active?: boolean;
    disabled?: boolean;
}

export const ButtonModtool: FC<ButtonModtoolProps> = props =>
{
    const { variant = '', size = '', active = false, disabled = false, classNames = [], ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'px-4 fw-bold' ];

        if(variant) newClassNames.push('btn-' + variant);

        if(size) newClassNames.push('btn-' + size);

        if(active) newClassNames.push('active');

        if(disabled) newClassNames.push('disabled');

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ variant, size, active, disabled, classNames ]);

    return <Flex classNames={ getClassNames } { ...rest } />;
}
