import React from 'react';
import { LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../features/User';

const LogoutButton = () => {
  const dispatch = useDispatch();

  const logout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      dispatch(logoutUser());
    }
  };

  return (
    <div className='mt-auto'>
      <LogOut className='w-6 h-6 text-white cursor-pointer' onClick={logout} />
    </div>
  );
};

export default LogoutButton;
