import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
    sessions: [],
};

export const sessionsSlice = createSlice({
    name: "sessions",
    initialState,
    reducers: {
        setSessionsData: (state, action) => {
            state.sessions = action.payload;
        },
        updateSessionsData: (state, action) => {
            const sessionData = { ...action.payload };
            sessionData.id = Number(sessionData.id);

            state.sessions = [sessionData, ...state.sessions];
        },
        modifySessionData: (state, action) => {
            const sessionData = { ...action.payload };
            sessionData.id = Number(sessionData.id);

            state.sessions = state.sessions.map((session) => {
                if (session.id === sessionData.id) {
                    return sessionData;
                }

                return session;
            });
        },
        deleteSessionsData: (state, action) => {
            const { id } = action.payload;
            state.sessions = state.sessions.filter((session) => session.id !== id);
        },
        resetSessionsData: (state) => {
            Object.assign(state, initialState);
        },
    },
});

// Action creators are generated for each case reducer function
export const {
    setSessionsData,
    updateSessionsData,
    deleteSessionsData,
    resetSessionsData,
    modifySessionData
} = sessionsSlice.actions;

export default sessionsSlice.reducer;
