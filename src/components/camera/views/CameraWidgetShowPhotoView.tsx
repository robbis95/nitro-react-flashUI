import { RoomObjectCategory, RoomObjectVariable } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { GetRoomEngine, GetUserProfile, IPhotoData, LocalizeText } from '../../../api';
import { Base, Flex, Text } from '../../../common';

export interface CameraWidgetShowPhotoViewProps
{
    currentIndex: number;
    currentPhotos: IPhotoData[];
}

export const CameraWidgetShowPhotoView: FC<CameraWidgetShowPhotoViewProps> = props =>
{
    const { currentIndex = -1, currentPhotos = null } = props;
    const [ imageIndex, setImageIndex ] = useState(0);

    const currentImage = (currentPhotos && currentPhotos.length) ? currentPhotos[imageIndex] : null;

    const next = () =>
    {
        setImageIndex(prevValue =>
        {
            let newIndex = (prevValue + 1);

            if(newIndex >= currentPhotos.length) newIndex = 0;

            return newIndex;
        });
    }

    const previous = () =>
    {
        setImageIndex(prevValue =>
        {
            let newIndex = (prevValue - 1);

            if(newIndex < 0) newIndex = (currentPhotos.length - 1);

            return newIndex;
        });
    }

    const getUserData = (roomId: number, objectId: number, type: string): number | string =>
    {
        const roomObject = GetRoomEngine().getRoomObject(roomId, objectId, RoomObjectCategory.WALL);
		
        if (!roomObject) return;
        
        return type == 'username' ? roomObject.model.getValue<number>(RoomObjectVariable.FURNITURE_OWNER_NAME) : roomObject.model.getValue<number>(RoomObjectVariable.FURNITURE_OWNER_ID);
    }

    useEffect(() =>
    {
        setImageIndex(currentIndex);
    }, [ currentIndex ]);

    if(!currentImage) return null;

    return (
        <Flex>
            <Flex center className="picture-preview border border-black" style={ currentImage.w ? { backgroundImage: 'url(' + currentImage.w + ')' } : {} }>
                { !currentImage.w && <Text bold>{ LocalizeText('camera.loading') }</Text> }
            </Flex>
            { currentImage.m && currentImage.m.length && <Text center>{ currentImage.m }</Text> }
            <Flex position="absolute" className="bottom-5 px-2">
                <Text small>{ new Date(currentImage.t * 1000).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' }) }</Text>
            </Flex>
            <Flex position="absolute" className="bottom-5 end-5 px-5">
                <Text pointer small underline onClick={ () => GetUserProfile(Number(getUserData(currentImage.s, Number(currentImage.u), 'id'))) }>{ getUserData(currentImage.s, Number(currentImage.u), 'username') }</Text>
            </Flex>
            { (currentPhotos.length > 1) &&
                <>
                    <Flex position="absolute" className="start-2 center-buttons">
                        <Base className="icon nitro-camera-button-left" onClick={ previous } />
                    </Flex>
                    <Flex position="absolute" className="end-2 center-buttons">
                        <Base className="icon nitro-camera-button-right" onClick={ next } />
                    </Flex>
                </>
            }
        </Flex>
    );
}
