import { FC, useMemo } from 'react';
import { Base, Column } from '../../common';

const generateRandomImageIndex = () => Math.floor(Math.random() * 30);

interface LoadingViewProps {
    isError?: boolean;
    message?: string;
    percent?: number;
}

export const LoadingView: FC<LoadingViewProps> = ({ isError = false, message = '', percent = 0 }) => 
{
    const randomImageIndex = useMemo(generateRandomImageIndex, []);

    return (
        <Column fullHeight alignItems="center" justifyContent="center" className="nitro-loading">
            <div className="loading-stories">
                <div className="loadingPhoto position-absolute" data-image={ randomImageIndex } />
                <div className="imageOverlay position-absolute"></div>
            </div>
            <Column className="text-center py-4">
                { isError && message ? (
                    <Base className="fs-4 text-shadow">{ message }</Base>
                ) : (
                    <>
                        <Base className="fs-4 text-shadow">{ message }</Base>
                        <div className="nitro-loading-bar mt-2">
                            <div className="nitro-loading-bar-inner" style={ { width: `${ percent }%` } } />
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
