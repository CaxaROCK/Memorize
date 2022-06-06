import { AUTH, LOGOUT } from "../actions/action_types";

const authReducer = (state = { authData: null }, action) => {
    //! state (posts) always has to be equal to something
    switch (action.type) {
        case AUTH:
            localStorage.setItem(
                "profile",
                JSON.stringify({ ...action?.data })
            );
            // console.log(action.data);
            return { ...state, authData: action?.data };
        case LOGOUT:
            localStorage.clear();
            return { ...state, authData: null };
        default:
            return state;
    }
};

export default authReducer;
