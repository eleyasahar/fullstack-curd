import { createContext, useState, useEffect } from "react";
import API from '../api/axiosInstance';

export const AuthContext = createContext();

export const AuthProvider = ({children })=> {
  const [user, setUser ] = useState(null);
  const[loading, setLoading ] = useState(true);

  useEffect(()=>{
    const checkAuth = async()=> {
      const token = localStorage.getItem('accessToken');
      if(token){
        try{
          const res = await API.get('/auth/me');
          setUser(res.data.user);
        }catch (error) {
          localStorage.removeItem('accessToken');
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkAuth()
  },[]);
   const login = async (email, password) => {
    const res = await API.post('/auth/login', {email, password});
    localStorage.setItem('accessToken', res.data.accessToken);
    setUser(res.data.user);
    return res.data;
   }
   const register = async (name, email, password, confirmPassword)=>{
    const res =await API.post('/auth/register', {name, email, password, confirmPassword})
    return res.data;
   };

   const logout = async ()=>{
    try{
      await API.post('/auth/logout');

    } catch (e) {
      console.error(e);
    } finally {
      localStorage.removeItem('accessToken');
      setUser(null)
    }
   };
   return (
    <AuthContext.Provider value={{user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
   );
};