import { createContext, useState } from "react";

// ========== COUNTER CONTEXT ==========
// This is for counting stuff
export const CounterContext = createContext();

export function CounterContextProvider({children}){
    const [count, setCount] = useState(0)
    
    return (
        <CounterContext.Provider value={{count, setCount}}>
            {children}
        </CounterContext.Provider>
    )
}
