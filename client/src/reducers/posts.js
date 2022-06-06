import {
    FETCH_ALL,
    FETCH_POST,
    FETCH_BY_SEARCH,
    CREATE,
    DELETE,
    UPDATE,
    LIKE,
    START_LOADING,
    END_LOADING,
    COMMENT,
} from "../actions/action_types";

export default (state = { isLoading: true, posts: [] }, action) => {
    //! state (posts) always has to be equal to something
    switch (action.type) {
        case START_LOADING:
            return { ...state, isLoading: true };
        case END_LOADING:
            return { ...state, isLoading: false };
        case FETCH_ALL:
            return {
                ...state,
                posts: action.payload.data,
                currentPage: action.payload.currentPage,
                numberOfPages: action.payload.numberOfPages,
            };
        case FETCH_POST:
            return { ...state, post: action.payload };
        case FETCH_BY_SEARCH:
            return { ...state, posts: action.payload };
        case CREATE:
            return { ...state, posts: [...state, action.payload] };
        case DELETE:
            return {
                ...state,
                posts: state.posts.filter(
                    (post) => post._id !== action.payload
                ),
            };
        case UPDATE:
        case LIKE:
            return {
                ...state,
                posts: state.posts.map((post) =>
                    post._id === action.payload._id ? action.payload : post
                ),
            };
        case COMMENT:
            return {
                ...state,
                posts: state.posts.map((post) => {
                    //change the post if id matching (update)
                    if (post._id === action.payload._id) return action.payload;

                    //otherwise just return the old post
                    return post;
                }),
            };
        default:
            return state;
    }
};
