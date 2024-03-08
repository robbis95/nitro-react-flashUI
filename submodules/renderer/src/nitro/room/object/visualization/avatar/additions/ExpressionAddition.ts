import { IRoomObjectSprite } from '../../../../../../api';
import { AvatarVisualization } from '../AvatarVisualization';
import { IExpressionAddition } from './IExpressionAddition';

export class ExpressionAddition implements IExpressionAddition
{
    private _id: number;
    private _type: number;
    private _visualization: AvatarVisualization;

    constructor(id: number, type: number, visualization: AvatarVisualization)
    {
        this._id = id;
        this._type = type;
        this._visualization = visualization;
    }

    public dispose(): void
    {
        this._visualization = null;
    }

    public update(sprite: IRoomObjectSprite, scale: number): void
    {
        return;
    }

    public animate(sprite: IRoomObjectSprite): boolean
    {
        return false;
    }

    public get id(): number
    {
        return this._id;
    }

    public get type(): number
    {
        return this._type;
    }

    public get visualization(): AvatarVisualization
    {
        return this._visualization;
    }
}
