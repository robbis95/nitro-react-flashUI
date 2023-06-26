import { NitroConfiguration } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { CatalogPageName, CreateLinkEvent } from '../../../../../api';

export interface WidgetContainerViewProps
{
    conf: any;
}

export const WidgetContainerView: FC<WidgetContainerViewProps> = props =>
{
    const { conf = null } = props;

    const getOption = (key: string) =>
    {
        const option = conf[key];

        if(!option) return null;

        switch(key)
        {
            case 'image':
                return NitroConfiguration.interpolate(option);

        }

        return option;
    }

  	return (
        <div className="widgetcontainer">
            <div className="widgetcontainer-image flex-shrink-0" style={ { backgroundImage: `url(${ getOption('image') })` } } />
            <div className="d-flex flex-column align-self-center">
                <h3 className="widgetcontainer-header ubuntu-bold">{ getOption('header') }</h3>
                <p className="widgetcontainer-body">{ getOption('body') }</p>
                <button className="btn widgetcontainer-button ubuntu-bold" onClick={ event => CreateLinkEvent('catalog/open/' + CatalogPageName.NEW_ADDITIONS) }>{ getOption('button') }</button>
            </div>
        </div>
  	);
}
