import { Children, useContext } from "react";
import {Navigate} from 'react-router-dom'
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({childere})=>{
  const {user, loading} = useContext(AuthContext);

  if(loading) return <div style={{padding: '20'}}>Loading...</div>;
  if(!user) return <Navigate to="/login" replace/>;

  return Children
};

export default ProtectedRoute;