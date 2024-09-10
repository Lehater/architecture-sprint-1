import React from 'react';
import EditProfilePopup from './components/EditProfilePopup';
import EditAvatarPopup from './components/EditAvatarPopup';

const ProfileApp = () => (
  <div>
    <h2>Profile Module</h2>
    <EditProfilePopup />
    <EditAvatarPopup />
  </div>
);

export default ProfileApp;