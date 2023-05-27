import { PetRespectComposer, PetType } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { AvatarInfoPet, ConvertSeconds, CreateLinkEvent, GetConfiguration, LocalizeText, SendMessageComposer } from '../../../../../api';
import { Base, Button, Column, Flex, LayoutCounterTimeView, LayoutPetImageView, LayoutRarityLevelView, Text } from '../../../../../common';
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
                CreateLinkEvent('catalog/open/' + GetConfiguration('catalog.links')['pets.buy_food']);
                break;
            case 'train':
                roomSession?.requestPetCommands(avatarInfo.id);
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
        <Column gap={ 1 } alignItems="end">
            <Column className="nitro-infostand">
                <Column overflow="visible" className="container-fluid content-area size-pets" gap={ 1 }>
                    <Column gap={ 1 }>
                        <Flex alignItems="center" justifyContent="between" gap={ 1 }>
                            &nbsp;
                            <Text variant="white" center bold wrap>{ avatarInfo.name }</Text>
                            <Base className="infostand-close" onClick={ onClose } />
                        </Flex>
                        <Text variant="white" center small wrap>{ LocalizeText(`pet.breed.${ avatarInfo.petType }.${ avatarInfo.petBreed }`) }</Text>
                    </Column>
                    { (avatarInfo.petType === PetType.MONSTERPLANT) &&
                        <>
                            <Column gap={ 1 }>
                                <Flex justifyContent="between">
                                    <Column fullWidth overflow="hidden" className="body-image pet p-1">
                                        <LayoutPetImageView figure={ avatarInfo.petFigure } posture={ avatarInfo.posture } direction={ 4 } />
                                    </Column>
                                    { !avatarInfo.dead && 
                                        <Text variant="white" center small wrap className="px-2">{ LocalizeText('pet.level', [ 'level', 'maxlevel' ], [ avatarInfo.level.toString(), avatarInfo.maximumLevel.toString() ]) }</Text>
                                    }
                                </Flex>
                                <Flex gap={ 1 }>
                                    <Column grow gap={ 1 }>
                                        <Column alignItems="center" gap={ 1 }>
                                            <Text variant="white" small truncate>{ LocalizeText('infostand.pet.text.wellbeing') }</Text>
                                            <Flex className="start-0" position="absolute">
                                                <Base className="icon-wellbeing" />
                                            </Flex>
                                            <Base fullWidth overflow="hidden" position="relative" className="bg-light-dark border border-light border-left height-bar">
                                                <Flex fit center position="absolute">
                                                    <Text variant="white" small>{ avatarInfo.dead ? '00:00:00' : ConvertSeconds((remainingTimeToLive == 0 ? avatarInfo.remainingTimeToLive : remainingTimeToLive)).split(':')[1] + ':' + ConvertSeconds((remainingTimeToLive == null || remainingTimeToLive == undefined ? 0 : remainingTimeToLive)).split(':')[2] + ':' + ConvertSeconds((remainingTimeToLive == null || remainingTimeToLive == undefined ? 0 : remainingTimeToLive)).split(':')[3] }</Text>
                                                </Flex>
                                                <Base className="bg-success rounded pet-stats" style={ { width: avatarInfo.dead ? '0' : Math.round((avatarInfo.maximumTimeToLive * 100) / (remainingTimeToLive)).toString() } } />
                                            </Base>
                                        </Column>
                                        { remainingGrowTime != 0 && remainingGrowTime > 0 &&
                                            <Column alignItems="center" gap={ 1 }>
                                                <Text variant="white" small truncate>{ LocalizeText('infostand.pet.text.growth') }</Text>
                                                <LayoutCounterTimeView className="top-2 end-2 mb-4" day={ ConvertSeconds(remainingGrowTime).split(':')[0] } hour={ ConvertSeconds(remainingGrowTime).split(':')[1] } minutes={ ConvertSeconds(remainingGrowTime).split(':')[2] } seconds={ ConvertSeconds(remainingGrowTime).split(':')[3] } />
                                            </Column>
                                        }
                                        <Column alignItems="center" gap={ 1 }>
                                            <Text variant="white" small truncate>{ LocalizeText('infostand.pet.text.raritylevel', [ 'level' ], [ LocalizeText(`infostand.pet.raritylevel.${ avatarInfo.rarityLevel }`) ]) }</Text>
                                            <LayoutRarityLevelView className="top-2 end-2" level={ avatarInfo.rarityLevel } />
                                        </Column>
                                    </Column>
                                </Flex>
                            </Column>
                        </>
                    }
                    { (avatarInfo.petType !== PetType.MONSTERPLANT) &&
                        <Column gap={ 1 }>
                            <Flex justifyContent="between">
                                <Column fullWidth overflow="hidden" className="body-image pet p-1">
                                    <LayoutPetImageView figure={ avatarInfo.petFigure } posture={ avatarInfo.posture } direction={ 4 } />
                                </Column>
                                <Text variant="white" center small wrap className="px-2">{ LocalizeText('pet.level', [ 'level', 'maxlevel' ], [ avatarInfo.level.toString(), avatarInfo.maximumLevel.toString() ]) }</Text>
                            </Flex>
                            <Flex gap={ 1 }>
                                <Column grow gap={ 1 }>
                                    <Column alignItems="center" gap={ 1 }>
                                        <Text variant="white" small truncate>{ LocalizeText('infostand.pet.text.happiness') }</Text>
                                        <Flex className="start-0" position="absolute">
                                            <Base className="icon-happiness" />
                                        </Flex>
                                        <Base fullWidth overflow="hidden" position="relative" className="bg-light-dark border border-light border-left height-bar">
                                            <Flex fit center position="absolute">
                                                <Text variant="white" small>{ avatarInfo.happyness + '/' + avatarInfo.maximumHappyness }</Text>
                                            </Flex>
                                            <Base className="bg-info pet-stats" style={ { width: (avatarInfo.happyness / avatarInfo.maximumHappyness) * 100 + '%' } } />
                                        </Base>
                                    </Column>
                                    <Column alignItems="center" gap={ 1 }>
                                        <Text variant="white" small truncate>{ LocalizeText('infostand.pet.text.experience') }</Text>
                                        <Flex className="start-0" position="absolute">
                                            <Base className="icon-experience" />
                                        </Flex>
                                        <Base fullWidth overflow="hidden" position="relative" className="bg-light-dark border border-light border-left height-bar">
                                            <Flex fit center position="absolute">
                                                <Text variant="white" small>{ avatarInfo.experience + '/' + avatarInfo.levelExperienceGoal }</Text>
                                            </Flex>
                                            <Base className="bg-purple pet-stats" style={ { width: (avatarInfo.experience / avatarInfo.levelExperienceGoal) * 100 + '%' } } />
                                        </Base>
                                    </Column>
                                    <Column alignItems="center" gap={ 1 }>
                                        <Text variant="white" small truncate>{ LocalizeText('infostand.pet.text.energy') }</Text>
                                        <Flex className="start-0" position="absolute">
                                            <Base className="icon-energy" />
                                        </Flex>
                                        <Base fullWidth overflow="hidden" position="relative" className="bg-light-dark border border-light border-left height-bar">
                                            <Flex fit center position="absolute">
                                                <Text variant="white" small>{ avatarInfo.energy + '/' + avatarInfo.maximumEnergy }</Text>
                                            </Flex>
                                            <Base className="bg-success pet-stats" style={ { width: (avatarInfo.energy / avatarInfo.maximumEnergy) * 100 + '%' } } />
                                        </Base>
                                    </Column>
                                </Column>
                            </Flex>
                        </Column>
                    }
                    <Column gap={ 1 } className="mt-4" alignItems="center" justifyContent="center">
                        { (avatarInfo.petType !== PetType.MONSTERPLANT) &&
                            <Text variant="white" small wrap>
                                { LocalizeText('infostand.text.petrespect', [ 'count' ], [ avatarInfo.respect.toString() ]) }
                                <Base className="icon-petting" />
                            </Text>
                        }
                        <Text variant="white" small wrap>{ LocalizeText('pet.age', [ 'age' ], [ avatarInfo.age.toString() ]) }</Text>
                        <Text variant="white" small wrap>{ LocalizeText('infostand.text.petowner', [ 'name' ], [ avatarInfo.ownerName ]) }</Text>
                    </Column>
                </Column>
            </Column>
            <Flex gap={ 2 } justifyContent="end">
                { (avatarInfo.petType !== PetType.MONSTERPLANT) &&
                    <Button className="infostand-buttons px-2" onClick={ event => processButtonAction('buyfood') }>
                        { LocalizeText('infostand.button.buyfood') }
                    </Button> }
                { avatarInfo.isOwner && (avatarInfo.petType !== PetType.MONSTERPLANT) &&
                    <Button className="infostand-buttons px-2" onClick={ event => processButtonAction('train') }>
                        { LocalizeText('infostand.button.train') }
                    </Button> }
                { !avatarInfo.dead && ((avatarInfo.energy / avatarInfo.maximumEnergy) < 0.98) && (avatarInfo.petType === PetType.MONSTERPLANT) &&
                    <Button className="infostand-buttons px-2" onClick={ event => processButtonAction('treat') }>
                        { LocalizeText('infostand.button.pettreat') }
                    </Button> }
                { roomSession?.isRoomOwner && (avatarInfo.petType === PetType.MONSTERPLANT) &&
                    <Button className="infostand-buttons px-2" onClick={ event => processButtonAction('compost') }>
                        { LocalizeText('infostand.button.compost') }
                    </Button> }
                { avatarInfo.isOwner &&
                    <Button className="infostand-buttons px-2" onClick={ event => processButtonAction('pick_up') }>
                        { LocalizeText('inventory.pets.pickup') }
                    </Button> }
                { (petRespectRemaining > 0) && (avatarInfo.petType !== PetType.MONSTERPLANT) &&
                    <Button className="infostand-buttons px-2" onClick={ event => processButtonAction('respect') }>
                        { LocalizeText('infostand.button.petrespect', [ 'count' ], [ petRespectRemaining.toString() ]) }
                    </Button> }
            </Flex>
        </Column>
    );
}
