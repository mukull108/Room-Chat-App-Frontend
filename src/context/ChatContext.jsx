import { createContext, useContext, useState } from "react";

const ChatContext = createContext()

export const ChatProvider = ({ children }) => {

    const [roomId, setRoomId] = useState('')
    const [userName, setUserName] = useState('')
    const [connected, setConnected] = useState(false)

    return <ChatContext.Provider value={{ 
        roomId, 
        userName,
        connected, 
        setRoomId, 
        setUserName,
        setConnected 
    }}>
        {children}
    </ChatContext.Provider>
}

const useChatContext=()=>useContext(ChatContext);
export default useChatContext;