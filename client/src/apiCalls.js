import axios from "axios";

export const loginCall = async (userCredential,dispatch) => {
    dispatch({ type: "LOGIN_START" });
    try{
        const res = await axios.post("http://localhost:8080/api/auth/login", userCredential);
        console.log( res );
        dispatch({type:"LOGIN_SUCCESS", payload: res.data});
    }catch(err){
        dispatch({type:"LOGIN_FAILURE", err});
    }
};