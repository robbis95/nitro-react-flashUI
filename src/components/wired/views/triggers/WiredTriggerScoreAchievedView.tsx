import { FC, useEffect, useState } from 'react';
import ReactSlider from 'react-slider';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { Column, Text } from '../../../../common';
import { useWiredContext } from '../../WiredContext';
import { WiredTriggerBaseView } from './WiredTriggerBaseView';

export const WiredTriggeScoreAchievedView: FC<{}> = props =>
{
    const [ points, setPoints ] = useState(1);
    const { trigger = null, setIntParams = null } = useWiredContext();

    const save = () => setIntParams([ points ]);

    useEffect(() =>
    {
        setPoints((trigger.intData.length > 0) ? trigger.intData[0] : 0);
    }, [ trigger ]);

    return (
        <WiredTriggerBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } hasSpecialInput={ true } save={ save }>
            <Column gap={ 1 }>
                <Text gfbold>{ LocalizeText('wiredfurni.params.setscore', [ 'points' ], [ points.toString() ]) }</Text>
                <ReactSlider
                    className={ 'wired-slider' }
                    min={ 1 }
                    max={ 1000 }
                    value={ points }
                    onChange={ event => setPoints(event) } />
            </Column>
        </WiredTriggerBaseView>
    );
}
