import { Action, Reducer } from 'redux';

interface SaveAction<T, D> extends Action<T> {
    data: D;
}

interface LazyState<D> {
    data: D;
    updated: string;
}

/**
 * With love for Thijs
 */
export class ReduxLazy<T extends string, D> {
    public readonly state: LazyState<D>;

    private readonly saveActionType: T;

    constructor(save: T, defaultState: D) {
        this.saveActionType = save;
        this.state = {
            data: defaultState,
            updated: new Date().toISOString(),
        };
    }

    public get actions(): SaveAction<T, D> {
        throw new Error('ReduxAsync.actions should only be used as a TypeScript type provider');
    }

    public get reducer(): Reducer<LazyState<D>> {
        const context: ReduxLazy<T, D> = this;

        return (s: LazyState<D> = context.state, action: Action): LazyState<D> => {
            switch(action.type) {
                case (context.saveActionType):
                    return {
                        ...s,
                        data: (<SaveAction<T, D>>action).data,
                        updated: new Date().toISOString(),
                    };
                default:
                    return s;
            }
        };
    }

    public run(i: D): SaveAction<T, D> {
        return {
            type: this.saveActionType,
            data: i,
        };
    }
}
