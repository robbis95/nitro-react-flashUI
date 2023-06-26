import { MysteryBoxKeysUpdateEvent } from '@nitrots/nitro-renderer';
import { FC, useState } from 'react';
import { ColorUtils, CreateLinkEvent, LocalizeText } from '../../../../api';
import { Base, Column, Flex, LayoutGridItem, Text } from '../../../../common';
import { useSessionDataManagerEvent } from '../../../../hooks';

const colorMap = {
    'purple': 9452386,
    'blue': 3891856,
    'green': 6459451,
    'yellow': 10658089,
    'lilac': 6897548,
    'orange': 10841125,
    'turquoise': 2661026,
    'red': 10104881
}

export const MysteryBoxExtensionView: FC<{}> = props =>
{
    const [ isOpen, setIsOpen ] = useState<boolean>(true);
    const [ keyColor, setKeyColor ] = useState<string>('');
    const [ boxColor, setBoxColor ] = useState<string>('');

    useSessionDataManagerEvent<MysteryBoxKeysUpdateEvent>(MysteryBoxKeysUpdateEvent.MYSTERY_BOX_KEYS_UPDATE, event =>
    {
        setKeyColor(event.keyColor);
        setBoxColor(event.boxColor);
    });

    const getRgbColor = (color: string) =>
    {
        const colorInt = colorMap[color];

        return ColorUtils.int2rgb(colorInt);
    }

    if(keyColor === '' && boxColor === '') return null;

    return (
        <Base className="nitro-notification-bubble mysterybox-extension">
            <Column>
                <Flex className="grouproom-header px-1" alignItems="center" justifyContent="between" pointer onClick={ event => setIsOpen(value => !value) }>
                    <Text bold variant="white">{ LocalizeText('mysterybox.tracker.title') }</Text>
                    <Base className="icon icon-nitro-card-header-close" />
                </Flex>
                { isOpen &&
                    <>
                        <Column className="px-2 pb-2">
                            <Text variant="white">{ LocalizeText('mysterybox.tracker.description') }</Text>
                            <Flex justifyContent="center" alignItems="center" gap={ 2 }>
                                <LayoutGridItem className="mysterybox-container">
                                    <div className="box-image flex-shrink-0" style={ { backgroundColor: getRgbColor(boxColor) } }>
                                        <div className="chain-overlay-image" />
                                    </div>
                                </LayoutGridItem>
                                <LayoutGridItem className="mysterybox-container">
                                    <div className="key-image flex-shrink-0" style={ { backgroundColor: getRgbColor(keyColor ) } }>
                                        <div className="key-overlay-image" />
                                    </div>
                                </LayoutGridItem>
                            </Flex>
                            <button className="report rounded px-2 overflow-hidden" onClick={ () => CreateLinkEvent('inventory/toggle') }>{ LocalizeText('mysterybox.tracker.return.button.text') }</button>
                            <Text pointer className="text-link" onClick={ null }>{ LocalizeText('mysterybox.tracker.link') }</Text>
                        </Column>
                    </> }
            </Column>
        </Base>
    );
}
