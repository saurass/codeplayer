import React, {useState, createContext, useEffect} from "react";
import { isAuthenticated } from "../services/auth/auth";
import {connectToSocketServer} from "../services/socket";

export const GlobalContext = createContext();

const newSocketConn = isAuthenticated() ? connectToSocketServer() : null

export const GlobalProvider = (props) => {
	const [globals, setGlobals] = useState(
		{
			socket: newSocketConn,
			loggedIn: isAuthenticated() ? true : false,
			verdict: null
		}																																																																																																																																																																																																																																																																																																																		
	);

	useEffect(() => {
		if(globals.socket) {
			globals.socket.on("update", msg => {
				setGlobals({...globals, verdict: msg})
			})
		}
	}, [])

	const {children} = props;

	return (
		<GlobalContext.Provider value={[globals, setGlobals]} >
			{children}
		</GlobalContext.Provider>
	)
}