import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import EditProfile from './EditProfile';
import type { RootState } from '../redux/store';

const EditProfileWrapper: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleSave = (updatedData: { avatarUrl?: string; firstName?: string; lastName?: string }) => {
    // Dispatch action to update user profile here
    // dispatch(updateUserProfile(updatedData))
    console.log('Save profile data:', updatedData);
  };

  if (!user) {
    return <div>Loading...</div>; // or redirect if no user
  }

  // return (
  //   <EditProfile
  //     avatarUrl={user.avatarUrl}
  //     firstName={user.firstName}
  //     lastName={user.lastName}
  //     email={user.email}
  //     onSave={handleSave}
  //   />
  // );
};
export default EditProfileWrapper;
