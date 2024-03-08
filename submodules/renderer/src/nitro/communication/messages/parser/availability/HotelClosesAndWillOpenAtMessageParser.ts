import { IMessageDataWrapper, IMessageParser } from '../../../../../api';

export class HotelClosesAndWillOpenAtMessageParser implements IMessageParser
{
    private _openHour: number;
    private _openMinute: number;
    private _userThrownOutAtClose: boolean;

    public flush(): boolean
    {
        this._openHour = 0;
        this._openMinute = 0;
        this._userThrownOutAtClose = false;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._openHour = wrapper.readInt();
        this._openMinute = wrapper.readInt();
        this._userThrownOutAtClose = wrapper.readBoolean();

        return true;
    }

    public get openHour(): number
    {
        return this._openHour;
    }

    public get openMinute(): number
    {
        return this._openMinute;
    }

    public get userThrowOutAtClose(): boolean
    {
        return this._userThrownOutAtClose;
    }
}
