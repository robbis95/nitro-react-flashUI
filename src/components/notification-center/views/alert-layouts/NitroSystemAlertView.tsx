import { FC } from 'react';
import { GetRendererVersion, GetUIVersion, NotificationAlertItem } from '../../../../api';
import { Button, Column, Flex, Grid, LayoutNotificationAlertView, LayoutNotificationAlertViewProps, Text } from '../../../../common';

interface NotificationDefaultAlertViewProps extends LayoutNotificationAlertViewProps
{
    item: NotificationAlertItem;
}

export const NitroSystemAlertView: FC<NotificationDefaultAlertViewProps> = props =>
{
    const { title = 'Nitro', onClose = null, ...rest } = props;

    return (
        <LayoutNotificationAlertView title={ title } onClose={ onClose } { ...rest }>
            <Grid>
                <Column center size={ 5 }>
                    <object data="https://assets.nitrodev.co/logos/nitro-n-dark.svg" width="100" height="100">&nbsp;</object>
                </Column>
                <Column size={ 7 }>
                    <Column alignItems="center" gap={ 0 }>
                        <Text bold fontSize={ 4 }>Nitro React</Text>
                        <Text>v{ GetUIVersion() }</Text>
                    </Column>
                    <Column alignItems="center">
                        <Text><b>Renderer:</b> v{ GetRendererVersion() }</Text>
                        <Column fullWidth gap={ 1 }>
                            <Button fullWidth variant="success" onClick={ event => window.open('https://discord.nitrodev.co') }>Discord</Button>
                            <Flex gap={ 1 }>
                                <Button fullWidth onClick={ event => window.open('https://git.krews.org/nitro/nitro-react') }>Git</Button>
                                <Button fullWidth onClick={ event => window.open('https://git.krews.org/nitro/nitro-react/-/issues') }>Bug Report</Button>
                            </Flex>
                        </Column>
                    </Column>
                </Column>
                <Column center size={ 5 }>
                    <Column className="flashui-logo"/>
                </Column>
                <Column size={ 7 }>
                    <Column alignItems="center" gap={ 0 }>
                        <Text bold fontSize={ 4 }>Flash UI-edit</Text>
                        <Text small>is created by Robbis</Text>
                    </Column>
                    <Column fullWidth gap={ 1 }>
                        <Button fullWidth variant="success" onClick={ event => window.open('https://discord.gg/j3bqtZKAF3') }>Flash-UI Discord</Button>
                        <Flex gap={ 1 }>
                            <Button fullWidth onClick={ event => window.open('https://git.krews.org/robbis1111/nitro-react-flashUI') }>Git</Button>
                            <Button fullWidth onClick={ event => window.open('https://git.krews.org/robbis1111/nitro-react-flashUI/-/issues') }>Bug Report</Button>
                        </Flex>
                    </Column>
                </Column>
            </Grid>
        </LayoutNotificationAlertView>
    );
}
