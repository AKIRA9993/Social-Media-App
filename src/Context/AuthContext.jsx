import { createContext, useEffect, useState } from "react";
import { getLoggedUserData } from "../Services/login";

export const AuthContext = createContext();

export default function AuthContextProvider({children}){
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('token') != null);
    const [userData, setUserData] = useState(null);

    // calling the api response we got from the getLoggedUserData
async function getUserData(){
    const response = await getLoggedUserData();
    if (response.message == 'success') {
        console.log('User Data:', response.user);
        setUserData(response.user)
    }
}

// component didMount to activate the function when the user is  first logged in
// and we also call it in didUpdate when isLoggedIn changes
    useEffect(() => {
        if (isLoggedIn) {
            getUserData();
        }
    }, [isLoggedIn])
    


    
    const login = (token) => {
        localStorage.setItem('token', token);
        setIsLoggedIn(true);
    };
    
    const logout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
    };
    
    return (
        <AuthContext.Provider value={{isLoggedIn, login, logout, userData}}>
            {children}
        </AuthContext.Provider>
    );
}