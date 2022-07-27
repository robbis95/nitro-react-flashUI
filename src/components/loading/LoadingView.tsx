import { FC } from 'react';
import { Base, Column, LayoutProgressBar, Text } from '../../common';

var randomImage = 'loadingPhoto position-absolute';
const randomImg: number = Math.floor(Math.random() * 30);

interface LoadingViewProps
{
    isError: boolean;
    message: string;
    percent: number;
}

export const LoadingView: FC<LoadingViewProps> = (props) =>
{
    const { isError = false, message = '', percent = 0 } = props;
    
    return (
        <Column fullHeight alignItems="center" justifyContent="center" className="nitro-loading">
            <div className="loading-stories">
                <div className="loadingPhoto position-absolute" data-image={ randomImg } />
                <div className="imageOverlay position-absolute"></div>
            </div>
            <Column className="text-center py-4">
                { isError && message && message.length ? (
                    <Base className="fs-4 text-shadow">{ message }</Base>
                ) : (
                    <>
                        <Base className="fs-4 text-shadow">{ message }</Base>
                        <div className="nitro-loading-bar mt-2">
                            <div
                                className="nitro-loading-bar-inner"
                                style={ { width: `${ percent }%` } }
                            />
                        </div>
                        <div className="percent">
                            <p>{ percent.toFixed() }%</p>
                        </div>
                    </>
                ) }
            </Column>
        </Column>
    );
};
