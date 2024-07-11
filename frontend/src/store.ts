import { configureStore } from '@reduxjs/toolkit'
import userReducer  from "./features/User/index"
import sideBarReducer from './features/Chats/fetchchats';
import  currentChatMessages  from './features/Messages/fetchMessages';

export const store = configureStore({
  reducer: {
    user: userReducer,
    SidebarChats : sideBarReducer,
    CurrentChatMessages:currentChatMessages,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch