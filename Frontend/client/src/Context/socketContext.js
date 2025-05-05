import { createContext, useContext, useState } from "react";


const socketContext = createContext()

export const SocketProvider = ({ children }) => {
    const [socket,setSocket] = useState('')
    return (
        < socketContext.Provider value={{socket,setSocket}} >
            {children}
        </socketContext.Provider >
    );
};

export const useSocket =() => useContext(socketContext)