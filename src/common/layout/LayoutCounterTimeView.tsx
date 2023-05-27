import { FC, useMemo } from 'react';
import { LocalizeText } from '../../api';
import { Base, BaseProps } from '../Base';
import { Flex } from '../Flex';

interface LayoutCounterTimeViewProps extends BaseProps<HTMLDivElement>
{
    day: string;
    hour: string;
    minutes: string;
    seconds: string;
}

export const LayoutCounterTimeView: FC<LayoutCounterTimeViewProps> = props =>
{
    const { day = '00', hour = '00', minutes = '00', seconds = '00', classNames = [], children = null, ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'nitro-counter-time' ];

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ classNames ]);

    return (
        <Flex gap={ 1 }>
            <Base classNames={ getClassNames } { ...rest }>
                <div>{ day != '00' ? day : hour }</div>
                <div className="text-stroke">{ day != '00' ? LocalizeText('countdown_clock_unit_days') : LocalizeText('countdown_clock_unit_hours') }</div>
            </Base>
            <Base className="text-stroke" style={ { marginTop: '5px', color: 'black' } }>:</Base>
            <Base classNames={ getClassNames } { ...rest }>
                <div>{ minutes }</div>
                <div className="text-stroke">{ LocalizeText('countdown_clock_unit_minutes') }</div>
            </Base>
            <Base className="text-stroke" style={ { marginTop: '5px', color: 'black' } }>:</Base>
            <Base classNames={ getClassNames } { ...rest }>
                <div>{ seconds }</div>
                <div className="text-stroke">{ LocalizeText('countdown_clock_unit_seconds') }</div>
            </Base>
            { children }
        </Flex>
    );
}
