import { Action, Reducer } from 'redux';

interface SaveAction<T, D> extends Action<T> {
    data: Partial<D>;
}

/**
 * With love for Thijs
 */
export class ReduxLazy<T extends string, D> {
    public readonly state: D;

    private readonly saveActionType: T;

    constructor(save: T, defaultState: D) {
        this.saveActionType = save;
        this.state = defaultState;
    }

    public get actions(): SaveAction<T, D> {
        throw new Error('ReduxAsync.actions should only be used as a TypeScript type provider');
    }

    public get reducer(): Reducer<D> {
        const context: ReduxLazy<T, D> = this;

        return (s: D = context.state, action: Action): D => {
            switch(action.type) {
                case (context.saveActionType):
                    return {
                        ...s,
                        ...(<SaveAction<T, D>>action).data,
                    };
                default:
                    return s;
            }
        };
    }

    public save(i: Partial<D>): SaveAction<T, D> {
        return {
            type: this.saveActionType,
            data: i,
        };
    }
}
