import React, { useEffect, useState } from 'react';
import styles from './EditProfile.module.scss';
import { Button, TextField } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {getUserProfile, updateProfile} from '../../redux/userSlice/user.thunks';
import {uploadFile} from "../../shared/utils/upload.ts";
import type IUser from "../../shared/models/IUser.ts";


const EditProfile: React.FC = () => {
  const { userId } = useParams(); // assuming route like /edit-profile/:userId
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useAppSelector((state) => state.user.currentUser);

  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    if (userId) {
      dispatch(getUserProfile(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (user) {
      setNewFirstName(user.firstName!);
      setNewLastName(user.lastName!);
    }
  }, [user]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setAvatarFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleSave = async () => { // Mark handleSave as async
    const newUserProfile = { ...user, firstName: newFirstName.trim(), lastName: newLastName.trim() };

    if (avatarFile) {
      const publicUrl = await uploadFile(avatarFile);
      console.log('publicUrl:', publicUrl);

      if (publicUrl !== undefined) {
        newUserProfile.imgUrl = publicUrl;
      } else {
        console.error("Avatar file upload failed, public URL is undefined.");
      }
    }
    dispatch(updateProfile(newUserProfile as IUser));

  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <Button variant="outlined" onClick={() => navigate(`/users/${user.id}/profile`)} className={styles.backButton}>
        Back to Profile Page
      </Button>
      <div className={styles.card}>
        <div className={styles.profileBlock}>
          <img
            src={avatarFile ? URL.createObjectURL(avatarFile) : user.avatarUrl}
            alt="Avatar"
            className={styles.avatar}
          />

          <div
            className={styles.uploadArea}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleFileChange}
              className={styles.hiddenInput}
              id="avatar-upload"
            />
            <label htmlFor="avatar-upload" className={styles.uploadLabel}>
              <CloudUploadIcon fontSize="large" />
              <div>Click to upload new image or drag and drop JPG, PNG (max 5MB)</div>
            </label>
            <div className={styles.recommendation}>Recommended: square image, at least 200×200px</div>
          </div>
        </div>

        <div className={styles.infoBlock}>
          <TextField
            label="First Name"
            value={newFirstName}
            onChange={(e) => setNewFirstName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Last Name"
            value={newLastName}
            onChange={(e) => setNewLastName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            value={user.username}
            fullWidth
            margin="normal"
            disabled
          />
          <Button variant="contained" color="primary" onClick={handleSave} className={styles.saveButton}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;