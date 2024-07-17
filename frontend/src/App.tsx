import { useEffect } from "react";
import { Routes, Route  } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store';
import { getMe } from "./features/User";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import Home from "./pages/Home";
import './App.css';
import ProtectedRoute from "./Routes/ProtectedRoute";
import VideoCall from "./pages/VideoCall";

function App() {
  const dispatch = useDispatch();
  const { error  } = useSelector((state: RootState) => state.user);


useEffect(() => {
if(!error){
  dispatch(getMe())
}
}, [])


  return (
    <div className='p-4 h-screen flex items-center justify-center'>
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/VideoCalling/:id" element={<VideoCall />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
}

export default App;
