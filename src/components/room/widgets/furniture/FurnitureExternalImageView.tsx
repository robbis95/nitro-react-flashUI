import { FC } from 'react';
import { GetSessionDataManager, ReportType } from '../../../../api';
import { Base, DraggableWindow, DraggableWindowPosition, Flex } from '../../../../common';
import { useFurnitureExternalImageWidget, useHelp } from '../../../../hooks';
import { CameraWidgetShowPhotoView } from '../../../camera/views/CameraWidgetShowPhotoView';

export const FurnitureExternalImageView: FC<{}> = props =>
{
    const { objectId = -1, currentPhotoIndex = -1, currentPhotos = null, onClose = null } = useFurnitureExternalImageWidget();
    const { report = null } = useHelp();

    if((objectId === -1) || (currentPhotoIndex === -1)) return null;

    return (
        <DraggableWindow handleSelector=".nitro-camera" windowPosition={ DraggableWindowPosition.CENTER }>
            <Flex className="nitro-camera nitro-external-image-widget">
                <Flex position="absolute" className="top-0 end-0 px-2 py-2">
                    <Base className="icon nitro-camera-report px-3" onClick={ () => report(ReportType.PHOTO, { extraData: currentPhotos[currentPhotoIndex].w, roomId: currentPhotos[currentPhotoIndex].s, reportedUserId: GetSessionDataManager().userId, roomObjectId: Number(currentPhotos[currentPhotoIndex].u) }) } />
                    <Base className="icon nitro-card-header-close" onClick={ onClose } />
                </Flex>
                <CameraWidgetShowPhotoView currentIndex={ currentPhotoIndex } currentPhotos={ currentPhotos } />
            </Flex>
        </DraggableWindow>
    );
}
