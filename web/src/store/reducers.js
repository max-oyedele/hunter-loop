import { combineReducers } from "redux";

import Login from "./auth/login/reducer";
import Data from "./data/reducer";

const rootReducer = combineReducers({  
  login: Login,
  data: Data
});

export default rootReducer;
