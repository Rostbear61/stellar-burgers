import store from '../src/services/store';

describe('Redux store', () => {
  it('initialize rootReducer', () => {
    const state = store.getState();
    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('feed');
    expect(state).toHaveProperty('constructor');
    expect(state).toHaveProperty('order');
  });
});