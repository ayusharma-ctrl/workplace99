import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./reducers/Reducer";


//importing all the reducers that we have and exporting them along with a custom name.. 
//e.g('login' is a custom name of this reducer called 'loginReducer')
//we can give any custom name to reducer as well while importing it in store
//Note: we will use this custom name to access store/all the redux states using useSelector
//we can directly import actions from the reducers to make changes
export default configureStore({
    reducer: {
        login: loginReducer 
    }
})