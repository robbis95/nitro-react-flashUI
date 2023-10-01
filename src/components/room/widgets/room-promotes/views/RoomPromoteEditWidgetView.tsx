import { EditEventMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useState } from 'react';
import { LocalizeText, SendMessageComposer } from '../../../../../api';
import { Column, LayoutInputErrorView, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../../common';

interface RoomPromoteEditWidgetViewProps
{
    eventId: number;
    eventName: string;
    eventDescription: string;
    setIsEditingPromote: (value: boolean) => void;
}

export const RoomPromoteEditWidgetView: FC<RoomPromoteEditWidgetViewProps> = props =>
{
    const { eventId = -1, eventName = '', eventDescription = '', setIsEditingPromote = null } = props;
    const [ newEventName, setNewEventName ] = useState<string>(eventName);
    const [ newEventDescription, setNewEventDescription ] = useState<string>(eventDescription);

    const updatePromote = () =>
    {
        if (!newEventName) return;
        
        SendMessageComposer(new EditEventMessageComposer(eventId, newEventName, newEventDescription));
    }

    return (
        <NitroCardView className="nitro-guide-tool no-resize" theme="primary">
            <NitroCardHeaderView headerText={ LocalizeText('navigator.eventsettings.editcaption') } onCloseClick={ () => setIsEditingPromote(false) } />
            <NitroCardContentView className="text-black">
                <Column gap={ 0 }>
                    <Text bold>{ LocalizeText('navigator.eventsettings.name') }</Text>
                    <input type="text" className={ `remove-outline ${ (newEventName.length < 3) ? 'input-error' : '' }` } maxLength={ 64 } value={ newEventName } onChange={ event => setNewEventName(event.target.value) } onBlur={ updatePromote } />
                    { (newEventName.length < 3) && <LayoutInputErrorView text={ LocalizeText('navigator.eventsettings.nameerr') } /> }
                </Column>
                <Column gap={ 0 }>
                    <Text bold>{ LocalizeText('navigator.eventsettings.desc') }</Text>
                    <textarea className="remove-outline" rows={ 6 } maxLength={ 64 } value={ newEventDescription } onChange={ event => setNewEventDescription(event.target.value) } onBlur={ updatePromote }></textarea>
                </Column>
            </NitroCardContentView>
        </NitroCardView>
    );
};
