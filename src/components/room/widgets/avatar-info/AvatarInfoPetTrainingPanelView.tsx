import { IRoomUserData, PetTrainingMessageParser, PetTrainingPanelMessageEvent } from '@nitrots/nitro-renderer';
import { FC, useState } from 'react';
import { CreateLinkEvent, LocalizeText } from '../../../../api';
import { Button, Column, Flex, Grid, LayoutPetImageView, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../common';
import { useMessageEvent, useRoom, useSessionInfo } from '../../../../hooks';

export const AvatarInfoPetTrainingPanelView: FC<{}> = props =>
{
    const [ petData, setPetData ] = useState<IRoomUserData>(null);
    const [ petTrainInformation, setPetTrainInformation ] = useState<PetTrainingMessageParser>(null);
    const { chatStyleId = 0 } = useSessionInfo();
    const { roomSession = null } = useRoom();

    useMessageEvent<PetTrainingPanelMessageEvent>(PetTrainingPanelMessageEvent, event =>
    {
        const parser = event.getParser();

        if (!parser) return;

        const roomPetData = roomSession.userDataManager.getPetData(parser.petId);

        if(!roomPetData) return;

        setPetData(roomPetData);
        setPetTrainInformation(parser);
    });

    const processPetAction = (petName: string, commandName: string) =>
    {
        if (!petName || !commandName) return;

        roomSession?.sendChatMessage(`${ petName } ${ commandName }`, chatStyleId);
    }

    if(!petData || !petTrainInformation) return null;

    return (
        <NitroCardView uniqueKey="pet-training" className="pet-training-window no-resize" theme="primary">
            <NitroCardHeaderView headerText={ LocalizeText('widgets.pet.commands.title') } isInfoToHabboPages={ true } onClickInfoHabboPages={ () => CreateLinkEvent('habbopages/help/pets/training') } onCloseClick={ () => setPetTrainInformation(null) } />
            <NitroCardContentView className="text-black">
                <Flex alignItems="center" justifyContent="center" gap={ 2 }>
                    <Grid columnCount={ 2 }>
                        <Column fullWidth overflow="hidden" className="body-image pet p-1">
                            <LayoutPetImageView figure={ petData.figure } posture={ 'std' } direction={ 2 } />
                        </Column>
                        <Text className="mt-2 px-2" variant="black" small>{ petData.name }</Text>
                    </Grid>
                </Flex>
                <Grid gap={ 1 } className="mb-5" columnCount={ 2 }>
                    {
                        (petTrainInformation.commands && petTrainInformation.commands.length > 0) && petTrainInformation.commands.map((command, index) =>
                            <Button className="overflow-hidden text-nowrap" key={ index } disabled={ !petTrainInformation.enabledCommands.includes(command) } onClick={ () => processPetAction(petData.name, LocalizeText(`pet.command.${ command }`)) }>{ LocalizeText(`pet.command.${ command }`) }</Button>
                        )
                    }
                </Grid>
            </NitroCardContentView>
        </NitroCardView>
    );
};
