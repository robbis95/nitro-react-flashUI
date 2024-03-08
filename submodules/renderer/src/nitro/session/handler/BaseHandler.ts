import { IConnection, IRoomHandlerListener } from '../../../api';
import { Disposable } from '../../../core';

export class BaseHandler extends Disposable
{
    private _connection: IConnection;
    private _listener: IRoomHandlerListener;
    private _roomId: number;

    constructor(connection: IConnection, listener: IRoomHandlerListener)
    {
        super();

        this._connection = connection;
        this._listener = listener;
        this._roomId = 0;
    }

    protected onDispose(): void
    {
        this._connection = null;
        this._listener = null;
    }

    public setRoomId(id: number): void
    {
        this._roomId = id;
    }

    public get connection(): IConnection
    {
        return this._connection;
    }

    public get listener(): IRoomHandlerListener
    {
        return this._listener;
    }

    public get roomId(): number
    {
        return this._roomId;
    }
}
