import { FC, useMemo, useRef } from 'react';
import { GetConfiguration } from '../../../api';
import { TransitionAnimation, TransitionAnimationTypes } from '../../../common';
import { Border } from './Border';

export const FrameLoading: FC<{ visible?: boolean }> = (props) => 
{
    const { visible = false } = props;

    const ref = useRef<HTMLDivElement>(null);

    const loadingUrl = useMemo(()=> GetConfiguration('images.url') + '/loading_icon.png',[])

    return <TransitionAnimation type={ TransitionAnimationTypes.FADE_IN } inProp={ visible } timeout={ 500 }>
        <Border opacity={ 150 } classNames={ [ 'position-absolute','top-0','bottom-0','start-0','end-0','justify-content-center','align-items-center','d-flex' ] } innerRef={ ref }>
            <img src={ loadingUrl } className="loading-spinner"/>
        </Border>
    </TransitionAnimation>;
}
