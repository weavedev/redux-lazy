# redux-lazy

[![GPL-3.0](https://img.shields.io/github/license/weavedev/redux-lazy.svg)](https://github.com/weavedev/redux-lazy/blob/master/LICENSE)
[![NPM](https://img.shields.io/npm/v/@weavedev/redux-lazy.svg)](https://www.npmjs.com/package/@weavedev/redux-lazy)

Quick save component for data storage in [Redux](http://redux.js.org/)

## Install

```
npm i @weavedev/redux-lazy
```

## Usage

### Creating

In this example we create a reducer and action to save an object  to the store containing a message.

```ts
import { ReduxLazy } from '@weavedev/redux-lazy';

interface MyState {
    message: string;
}

const SAVE_ACTION = 'SAVE_ACTION';
const defaultState: MyState = {
    message: 'Hello!',
};
export const message = new ReduxLazy(SAVE_ACTION, defaultState);

// If you are also using our store package (@weavedev/store)
window.storeReducers.message = message.reducer;

declare global {
    interface StoreReducersMap {
        message: typeof message.reducer;
    }

    interface StoreActionsMap {
        message: typeof message.actions;
    }
}
```

### Saving

You can update the state by calling `.save()`. The argument type matches that of the default state provided in the constructor.

```ts
import { message } from './message';

// If you are also using our store package (@weavedev/store)
window.store.dispatch(message.save({ message: 'Hey!' }));
```

## License

[GPL-3.0](https://github.com/weavedev/redux-lazy/blob/master/LICENSE)

Made by [Paul Gerarts](https://github.com/gerarts) and [Weave](https://weave.nl)

