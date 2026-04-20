import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SessionInfo {
    prolificId: string;
}

interface SessionInfoContextType {
    sessionInfo: SessionInfo;
    setSessionInfo: React.Dispatch<React.SetStateAction<SessionInfo>>;
}

const SessionInfoContext = createContext<SessionInfoContextType | undefined>(undefined);

export const SessionInfoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [sessionInfo, setSessionInfo] = useState<SessionInfo>({ prolificId: '' });

    return (
        <SessionInfoContext.Provider value={{ sessionInfo, setSessionInfo }}>
            {children}
        </SessionInfoContext.Provider>
    );
};

export const useSessionInfo = () => {
    const context = useContext(SessionInfoContext);
    if (!context) {
        throw new Error("useUserInfo must be used within a UserInfoProvider");
    }
    return context;
};
