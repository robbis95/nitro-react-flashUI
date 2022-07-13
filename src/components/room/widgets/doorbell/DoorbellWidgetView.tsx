import { FC, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../api';
import { Base, Button, Column, Flex, Grid, Text, NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../common';
import { useDoorbellWidget } from '../../../../hooks';

export const DoorbellWidgetView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const { users = [], answer = null } = useDoorbellWidget();

    useEffect(() =>
    {
        setIsVisible(!!users.length);
    }, [ users ]);

    if(!isVisible) return null;

    return (
        <NitroCardView className="nitro-widget-doorbell" theme="primary">
            <NitroCardHeaderView headerText={ LocalizeText('navigator.doorbell.title') } onCloseClick={ event => setIsVisible(false) } />
            <NitroCardContentView overflow="hidden" gap={ 0 }>
                <Column gap={ 2 }>
                    <Grid gap={ 1 } className="px-1 pb-1">
                        <Text small className="g-col-10">{ LocalizeText('widgets.doorbell.info') }</Text>
                    </Grid>
                </Column>
                <Column overflow="auto" className="striped-children" gap={ 0 }>
                    { users && (users.length > 0) && users.map(userName =>
                    {
                        return (
                            <Grid key={ userName } gap={ 1 } alignItems="center" className="text-black p-1">
                                <Text small className="g-col-6">{ userName }</Text>
                                <Base className="g-col-6">
                                    <Flex alignItems="center" justifyContent="end" gap={ 1 }>
                                        <i className="icon icon-accept-check cursor-pointer" onClick={ () => answer(userName, true) }/>
                                        <i className="icon icon-decline-x cursor-pointer" onClick={ () => answer(userName, false) }/>
                                    </Flex>
                                </Base>
                            </Grid>
                        );
                    }) }
                </Column>
            </NitroCardContentView>
        </NitroCardView>
    );
}
