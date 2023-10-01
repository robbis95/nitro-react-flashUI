import { NitroRectangle, NitroRenderTexture } from '@nitrots/nitro-renderer';
import { FC, useRef } from 'react';
import { GetRoomEngine, LocalizeText, PlaySound, SoundNames } from '../../api';
import { Button } from '../Button';
import { Flex } from '../Flex';
import { DraggableWindow } from '../draggable-window';

interface LayoutMiniCameraViewProps
{
    roomId: number;
    textureReceiver: (texture: NitroRenderTexture) => void;
    onClose: () => void;
}

export const LayoutMiniCameraView: FC<LayoutMiniCameraViewProps> = props =>
{
    const { roomId = -1, textureReceiver = null, onClose = null } = props;
    const elementRef = useRef<HTMLDivElement>();

    const getCameraBounds = () =>
    {
        if(!elementRef || !elementRef.current) return null;

        const frameBounds = elementRef.current.getBoundingClientRect();
        
        return new NitroRectangle(Math.floor(frameBounds.x), Math.floor(frameBounds.y), Math.floor(frameBounds.width), Math.floor(frameBounds.height));
    }

    const takePicture = () =>
    {
        PlaySound(SoundNames.CAMERA_SHUTTER);
        textureReceiver(GetRoomEngine().createTextureFromRoom(roomId, 1, getCameraBounds()));
    }
    
    return (
        <DraggableWindow handleSelector=".nitro-room-thumbnail-camera">
            <Flex className="nitro-room-thumbnail-camera pt-2 px-1">
                <div ref={ elementRef } className={ 'camera-frame' } />
                <Flex gap={ 1 } className="align-items-end camera-buttons">
                    <Button variant="danger" onClick={ onClose }>{ LocalizeText('cancel') }</Button>
                    <Button variant="success" onClick={ takePicture }>{ LocalizeText('navigator.thumbeditor.save') }</Button>
                </Flex>
            </Flex>
        </DraggableWindow>
    );
};
