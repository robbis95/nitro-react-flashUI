import { NitroSettingsEvent } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { LocalizeText } from '../../../api';
import { Button, Column, Flex, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../common';

interface UserSettingsWidgetViewProps
{
    userSettings: NitroSettingsEvent;
    catalogPlaceMultipleObjects: boolean;
    catalogSkipPurchaseConfirmation: boolean;
    selectedSettings: 'audio' | 'other';
    setCatalogPlaceMultipleObjects: (value: boolean) => void;
    setCatalogSkipPurchaseConfirmation: (value: boolean) => void;
    saveRangeSlider: (type: string) => void;
    processAction: (type: string, value?: any) => void;
}

export const UserSettingsWidgetView: FC<UserSettingsWidgetViewProps> = props =>
{
    const { userSettings = null, catalogPlaceMultipleObjects = null, catalogSkipPurchaseConfirmation = null, selectedSettings = null, setCatalogPlaceMultipleObjects = null, setCatalogSkipPurchaseConfirmation = null, saveRangeSlider = null, processAction = null } = props;

    if(!userSettings) return null;
    
    return (
        <NitroCardView uniqueKey="user-settings" className="user-settings-window no-resize" theme="settings">
            <NitroCardHeaderView hideButtonClose headerText={ selectedSettings === 'other' ? LocalizeText('widget.memenu.settings.other') : LocalizeText('widget.memenu.settings.title') } onCloseClick={ null } />
            <NitroCardContentView gap={ 3 } className="text-white">
                { (selectedSettings === 'other') &&
                    <Column gap={ 1 }>
                        <Flex alignItems="center" gap={ 1 }>
                            <input className="flash-form-check-input" type="checkbox" checked={ userSettings.oldChat } onChange={ event => processAction('oldchat', event.target.checked) } />
                            <Text>{ LocalizeText('memenu.settings.chat.prefer.old.chat') }</Text>
                        </Flex>
                        <Flex alignItems="center" gap={ 1 }>
                            <input className="flash-form-check-input" type="checkbox" checked={ userSettings.roomInvites } onChange={ event => processAction('room_invites', event.target.checked) } />
                            <Text>{ LocalizeText('memenu.settings.other.ignore.room.invites') }</Text>
                        </Flex>
                        <Flex alignItems="center" gap={ 1 }>
                            <input className="flash-form-check-input" type="checkbox" checked={ userSettings.cameraFollow } onChange={ event => processAction('camera_follow', event.target.checked) } />
                            <Text>{ LocalizeText('memenu.settings.other.disable.room.camera.follow') }</Text>
                        </Flex>
                        <Flex alignItems="center" gap={ 1 }>
                            <input className="flash-form-check-input" type="checkbox" checked={ catalogPlaceMultipleObjects } onChange={ event => setCatalogPlaceMultipleObjects(event.target.checked) } />
                            <Text>{ LocalizeText('memenu.settings.other.place.multiple.objects') }</Text>
                        </Flex>
                        <Flex alignItems="center" gap={ 1 }>
                            <input className="flash-form-check-input" type="checkbox" checked={ catalogSkipPurchaseConfirmation } onChange={ event => setCatalogSkipPurchaseConfirmation(event.target.checked) } />
                            <Text>{ LocalizeText('memenu.settings.other.skip.purchase.confirmation') }</Text>
                        </Flex>
                    </Column>
                }
                { (selectedSettings === 'audio') &&
                    <Column>
                        <Text center>{ LocalizeText('widget.memenu.settings.volume') }</Text>
                        <Flex gap={ 2 }>
                            <Text className="w-25">{ LocalizeText('widget.memenu.settings.volume.ui') }</Text>
                            <Flex alignItems="center" gap={ 1 }>
                                <i className={ (userSettings.volumeSystem > 1) ? 'icon icon-sound-off' : 'icon icon-sound-off-active' } />
                                <Column gap={ 0 }>
                                    <Flex className="number-range" />
                                    <input type="range" className="custom-range" min="0" max="100" step="1" id="volumeSystem" value={ userSettings.volumeSystem } onChange={ event => processAction('system_volume', event.target.value) } onMouseUp={ () => saveRangeSlider('volume') }/>
                                </Column>
                                <i className={ (userSettings.volumeSystem < 1) ? 'icon icon-sound-on' : 'icon icon-sound-on-active' } />
                            </Flex>
                        </Flex>
                        <Flex gap={ 2 }>
                            <Text className="w-25">{ LocalizeText('widget.memenu.settings.volume.furni') }</Text>
                            <Flex alignItems="center" gap={ 1 }>
                                <i className={ (userSettings.volumeFurni > 1) ? 'icon icon-sound-off' : 'icon icon-sound-off-active' } />
                                <Column gap={ 0 }>
                                    <Flex className="number-range" />
                                    <input type="range" className="custom-range" min="0" max="100" step="1" id="volumeFurni" value={ userSettings.volumeFurni } onChange={ event => processAction('furni_volume', event.target.value) } onMouseUp={ () => saveRangeSlider('volume') }/>
                                </Column>
                                <i className={ (userSettings.volumeFurni < 1) ? 'icon icon-sound-on' : 'icon icon-sound-on-active' } />
                            </Flex>
                        </Flex>
                        <Flex gap={ 2 }>
                            <Text className="w-25">{ LocalizeText('widget.memenu.settings.volume.trax') }</Text>
                            <Flex alignItems="center" gap={ 1 }>
                                <i className={ (userSettings.volumeTrax > 1) ? 'icon icon-sound-off' : 'icon icon-sound-off-active' } />
                                <Column gap={ 0 }>
                                    <Flex className="number-range" />
                                    <input type="range" className="custom-range" min="0" max="100" step="1" id="volumeTrax" value={ userSettings.volumeTrax } onChange={ event => processAction('trax_volume', event.target.value) } onMouseUp={ () => saveRangeSlider('volume') }/>
                                </Column>
                                <i className={ (userSettings.volumeTrax < 1) ? 'icon icon-sound-on' : 'icon icon-sound-on-active' } />
                            </Flex>
                        </Flex>
                    </Column>
                }
                <Flex alignItems="end">
                    <Button onClick={ event => processAction('close_view') }>{ LocalizeText('widget.memenu.back') }</Button>
                </Flex>
            </NitroCardContentView>
        </NitroCardView>
    );
}
