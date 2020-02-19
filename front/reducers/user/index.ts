import produce from "immer";

const initialState = {};

export default (state = initialState, action) => {
  return produce(state, draft => {
    switch (action.type) {
      default: {
        break;
      }
    }
  });
};
