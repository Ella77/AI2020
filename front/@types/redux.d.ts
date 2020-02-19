import * as Redux from "redux";
import createSagaMiddleware from "react-redux";

const sagaMiddleware = createSagaMiddleware();

declare module "redux" {
  export interface Store {
    sagaTask: typeof sagaMiddleware.run; // provide the types for `store.sagaTask` here
  }
}
