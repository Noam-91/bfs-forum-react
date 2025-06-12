import React, { useState } from 'react';
import styles from './EditProfile.module.scss';
import { Button, TextField } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useNavigate } from 'react-router-dom';

interface EditProfileProps {
  avatarUrl?: string;
  firstName: string;
  lastName: string;
  email: string;
  onSave: (updatedData: { avatarUrl?: string; firstName?: string; lastName?: string }) => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ avatarUrl, firstName, lastName, email, onSave }) => {
  const navigate = useNavigate();

  const [newFirstName, setNewFirstName] = useState(firstName);
  const [newLastName, setNewLastName] = useState(lastName);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

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

  const handleSave = () => {
    const update: { firstName?: string; lastName?: string; avatarFile?: File } = {};
    if (newFirstName.trim() && newFirstName !== firstName) update.firstName = newFirstName.trim();
    if (newLastName.trim() && newLastName !== lastName) update.lastName = newLastName.trim();
    if (avatarFile) update.avatarFile = avatarFile;
    if (Object.keys(update).length > 0) onSave(update);
  };

  return (
    <div className={styles.container}>
      <Button variant="outlined" onClick={() => navigate('/profile')} className={styles.backButton}>
        Back to Profile Page
      </Button>
      <div className={styles.card}>
      <div className={styles.profileBlock}>
        <img src={avatarFile ? URL.createObjectURL(avatarFile) : avatarUrl} alt="Avatar" className={styles.avatar} />

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
          value={email}
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
