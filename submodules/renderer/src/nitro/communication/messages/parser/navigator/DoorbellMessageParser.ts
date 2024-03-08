import { IMessageDataWrapper, IMessageParser } from '../../../../../api';

export class DoorbellMessageParser implements IMessageParser
{
    private _userName: string;

    public flush(): boolean
    {
        this._userName = null;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._userName = wrapper.readString();

        return true;
    }

    public get userName(): string
    {
        return this._userName;
    }
}
