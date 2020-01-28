import { SagaIterator } from '@redux-saga/types';
import { ActionMap, InternalReducer, Reduxable } from '@weavedev/reduxable';
import { Action } from 'redux';
import { put } from 'redux-saga/effects';

interface SaveAction<T, D> extends Action<T> {
    data: D;
}

interface ReduxLazyActionMap<T, D> extends ActionMap {
    save: SaveAction<T, D>;
}

interface LazyState<D> {
    data: D;
    updated: {
        data: string;
    };
}

/**
 * With love for Thijs
 */
export class ReduxLazy<T extends string, D> extends Reduxable<LazyState<D>, ReduxLazyActionMap<T, D>, [D]> {
    public readonly defaultStateData: D;

    private readonly saveActionType: T;

    constructor(save: T, defaultState: D) {
        super();
        this.saveActionType = save;
        this.defaultStateData = defaultState;
    }

    public get actionMap(): ReduxLazyActionMap<T, D> {
        throw new Error('ReduxAsync.actions should only be used as a TypeScript type provider');
    }

    public get defaultState(): LazyState<D> {
        return {
            data: this.defaultStateData,
            updated: {
                data: new Date().toISOString(),
            },
        };
    }

    public get internalReducer(): InternalReducer<LazyState<D>> {
        const context: ReduxLazy<T, D> = this;

        return (s: LazyState<D>, action: Action): LazyState<D> => {
            switch(action.type) {
                case (context.saveActionType):
                    return {
                        ...s,
                        data: (<SaveAction<T, D>>action).data,
                        updated: {
                            data: new Date().toISOString(),
                        },
                    };
                default:
                    return s;
            }
        };
    }

    public get saga(): (() => Iterator<never>) {
        return function* (): Iterator<never> {/* Stub */};
    }

    public run(i: D): SaveAction<T, D> {
        return {
            type: this.saveActionType,
            data: i,
        };
    }

    public get runSaga(): (i: D) => SagaIterator<LazyState<D>> {
        const context: ReduxLazy<T, D> = this;

        return function* (i: D): SagaIterator<LazyState<D>> {
            // Fire request
            yield put(context.run(i));

            // Simulate the next store state
            return context.state;
        };
    }
}
