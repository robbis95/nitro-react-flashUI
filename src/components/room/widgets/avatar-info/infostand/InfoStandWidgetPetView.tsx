import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PetRespectComposer, PetType } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { AvatarInfoPet, ConvertSeconds, CreateLinkEvent, GetConfiguration, LocalizeText, SendMessageComposer } from '../../../../../api';
import { Base, Button, Column, Flex, LayoutCounterTimeView, LayoutPetImageView, LayoutRarityLevelView, Text, UserProfileIconView } from '../../../../../common';
import { useRoom, useSessionInfo } from '../../../../../hooks';

interface InfoStandWidgetPetViewProps
{
    avatarInfo: AvatarInfoPet;
    onClose: () => void;
}

export const InfoStandWidgetPetView: FC<InfoStandWidgetPetViewProps> = props =>
{
    const { avatarInfo = null, onClose = null } = props;
    const [ remainingGrowTime, setRemainingGrowTime ] = useState(0);
    const [ remainingTimeToLive, setRemainingTimeToLive ] = useState(0);
    const { roomSession = null } = useRoom();
    const { petRespectRemaining = 0, respectPet = null } = useSessionInfo();

    useEffect(() =>
    {
        setRemainingGrowTime(avatarInfo.remainingGrowTime);
        setRemainingTimeToLive(avatarInfo.remainingTimeToLive);
    }, [ avatarInfo ]);

    useEffect(() =>
    {
        if((avatarInfo.petType !== PetType.MONSTERPLANT) || avatarInfo.dead) return;
        
        const interval = setInterval(() =>
        {
            setRemainingGrowTime(prevValue => (prevValue - 1));
            setRemainingTimeToLive(prevValue => (prevValue - 1));
        }, 1000);

        return () => clearInterval(interval);
    }, [ avatarInfo ]);

    if(!avatarInfo) return null;

    const processButtonAction = (action: string) =>
    {
        let hideMenu = true;

        if (!action || action == '') return;

        switch (action)
        {
            case 'respect':
                respectPet(avatarInfo.id);

                if((petRespectRemaining - 1) >= 1) hideMenu = false;
                break;
            case 'buyfood':
                CreateLinkEvent('catalog/open/' + GetConfiguration('catalog.links')['pets.buy_saddle']);
                break;
            case 'train':
                // not coded
                break;
            case 'treat':
                SendMessageComposer(new PetRespectComposer(avatarInfo.id));
                break;
            case 'compost':
                roomSession?.compostPlant(avatarInfo.id);
                break;
            case 'pick_up':
                roomSession?.pickupPet(avatarInfo.id);
                break;
        }

        if(hideMenu) onClose();
    }

    return (
        <Column className="nitro-infostand rounded">
            <Column overflow="visible" className="container-fluid content-area" gap={ 1 }>
                <Column gap={ 1 }>
                    <Flex alignItems="center" justifyContent="between" gap={ 1 }>
                        <Text variant="white" small wrap>{ avatarInfo.name }</Text>
                        <FontAwesomeIcon icon="times" className="cursor-pointer" onClick={ onClose } />
                    </Flex>
                    <Text variant="white" small wrap>{ LocalizeText(`pet.breed.${ avatarInfo.petType }.${ avatarInfo.petBreed }`) }</Text>
                    <hr className="m-0" />
                </Column>
                <Column gap={ 1 }>
                    <Flex gap={ 1 }>
                        <Column fullWidth overflow="hidden" className="body-image pet p-1">
                            <LayoutPetImageView figure={ avatarInfo.petFigure } posture={ avatarInfo.posture } direction={ 4 } />
                        </Column>
                        <Column grow gap={ 1 }>
                            <Text variant="white" center small wrap>{ LocalizeText('pet.level', [ 'level', 'maxlevel' ], [ avatarInfo.level.toString(), avatarInfo.maximumLevel.toString() ]) }</Text>
                            <Column alignItems="center" gap={ 1 }>
                                <Text variant="white" truncate>{ LocalizeText('infostand.pet.text.happiness') }</Text>
                                <Base fullWidth overflow="hidden" position="relative" className="bg-light-dark rounded">
                                    <Flex fit center position="absolute">
                                        <Text variant="white" small>{ avatarInfo.happyness + '/' + avatarInfo.maximumHappyness }</Text>
                                    </Flex>
                                    <Base className="bg-info rounded pet-stats" style={ { width: (avatarInfo.happyness / avatarInfo.maximumHappyness) * 100 + '%' } } />
                                </Base>
                            </Column>
                            <Column alignItems="center" gap={ 1 }>
                                <Text variant="white" truncate>{ LocalizeText('infostand.pet.text.experience') }</Text>
                                <Base fullWidth overflow="hidden" position="relative" className="bg-light-dark rounded">
                                    <Flex fit center position="absolute">
                                        <Text variant="white" small>{ avatarInfo.experience + '/' + avatarInfo.levelExperienceGoal }</Text>
                                    </Flex>
                                    <Base className="bg-purple rounded pet-stats" style={ { width: (avatarInfo.experience / avatarInfo.levelExperienceGoal) * 100 + '%' } } />
                                </Base>
                            </Column>
                            <Column alignItems="center" gap={ 1 }>
                                <Text variant="white" truncate>{ LocalizeText('infostand.pet.text.energy') }</Text>
                                <Base fullWidth overflow="hidden" position="relative" className="bg-light-dark rounded">
                                    <Flex fit center position="absolute">
                                        <Text variant="white" small>{ avatarInfo.energy + '/' + avatarInfo.maximumEnergy }</Text>
                                    </Flex>
                                    <Base className="bg-success rounded pet-stats" style={ { width: (avatarInfo.energy / avatarInfo.maximumEnergy) * 100 + '%' } } />
                                </Base>
                            </Column>
                        </Column>
                    </Flex>
                    <hr className="m-0" />
                </Column>
                <Column gap={ 1 }>
                    <Text variant="white" small wrap>{ LocalizeText('infostand.text.petrespect', [ 'count' ], [ avatarInfo.respect.toString() ]) }</Text>
                    <Text variant="white" small wrap>{ LocalizeText('pet.age', [ 'age' ], [ avatarInfo.age.toString() ]) }</Text>
                    <hr className="m-0" />
                </Column>
                <Column gap={ 1 }>
                    <Flex alignItems="center" gap={ 1 }>
                        <UserProfileIconView userId={ avatarInfo.ownerId } />
                        <Text variant="white" small wrap>
                            { LocalizeText('infostand.text.petowner', [ 'name' ], [ avatarInfo.ownerName ]) }
                        </Text>
                    </Flex>
                </Column>
            </Column>
        </Column>
    );
}
