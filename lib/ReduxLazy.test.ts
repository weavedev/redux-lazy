import { applyMiddleware, createStore, Store } from 'redux';
import reduxSaga, { SagaIterator, SagaMiddleware } from 'redux-saga';
import { call } from 'redux-saga/effects';
import { ReduxLazy } from './ReduxLazy';

interface DefaultState {
    amount: number;
    message: string;
}

const defaultState: DefaultState = {
    amount: 0,
    message: 'default',
};

let l: ReduxLazy<'S', DefaultState>;
let store: Store<typeof l.state>;
let sagaMiddleware: SagaMiddleware;

beforeEach(() => {
    l = new ReduxLazy('S', defaultState);
    sagaMiddleware = reduxSaga();
    store = createStore(
        l.reducer,
        applyMiddleware(sagaMiddleware),
    );
    sagaMiddleware.run(l.saga);
});

test('Should throw when accessing .actionMap', () => {
    expect(() => {
        console.log(l.actionMap, 'never');
    }).toThrowError();
});

test('Should return action types from actionTypeMap', () => {
    expect(l.actionTypeMap.save).toEqual('S');
});

test('Should set default data on the store', () => {
    expect(store.getState().data).toEqual({ amount: 0, message: 'default' });
});

test('Should return default data from .state.data before attach', () => {
    expect(new ReduxLazy('S', defaultState).state.data).toEqual({ amount: 0, message: 'default' });
});

test('Should return new state from .state.data after processing action', () => {
    store.dispatch(l.run({ amount: 24, message: 'two-four' }));
    expect(l.state.data).toEqual({ amount: 24, message: 'two-four' });
});

test('Should set new state on store after processing action', () => {
    store.dispatch(l.run({ amount: 91, message: '90 and one' }));
    expect(store.getState().data).toEqual({ amount: 91, message: '90 and one' });
});

test('Should return result when running runSaga', (done: () => void) => {
    let result: typeof l.state;

    sagaMiddleware.run(function* (): SagaIterator {
        result = <typeof l.state>(yield call(l.runSaga, { amount: 42, message: 'A Dent' }));

        expect(result.data).toEqual({ amount: 42, message: 'A Dent' });

        done();
    });
});
