import React from 'react';
import styles from './dashboard.module.css';
import DashboardLayout from '../../../components/DashBoardLayout/DashboardLayout';
import { BsPersonCircle } from 'react-icons/bs';
import { useEffect, useState } from 'react';
import axios from 'axios';
import UserLoader from '../../../components/UserLoader/UserLoader';
import ProfileModal from '../../../components/ProfileModal/ProfileModal';

const Profile = () => {
  const [userProfile, setUserProfile] = useState(null);

  const [showPopup, setShowPopup] = useState(false);

  const [buttonLoader, setButtonLoader] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/api/customers/profile-details');
      if (res) {
        setUserProfile(res.data);
      }
    } catch (error) {
      console.log('');
    }
  };

  const editUser = async () => {
    setShowPopup(!showPopup);

    await new Promise((resolve) => setTimeout(resolve, 2000));
    setButtonLoader(true);
  };

  return (
    <DashboardLayout>
      <h3 className={styles.header}>
        Profile Details
        <BsPersonCircle className={styles.comming_soon_icon} />
      </h3>
      {!userProfile && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '30px',
          }}
        >
          <UserLoader />
        </div>
      )}
      {userProfile && (
        <div className={styles.profile_container}>
          <div className={styles.profile_items}>
            <p>Full Name:</p>
            <p>{userProfile?.fullName}</p>
          </div>
          <div className={styles.profile_items}>
            <p>Email:</p>
            <p>{userProfile?.email}</p>
          </div>

          <div className={styles.profile_items}>
            <p>Wallet Address:</p>
            <p>USDT (TRC-20) - {userProfile?.walletAddress}</p>
          </div>

          <button onClick={editUser} className={styles.edit_wallet}>
            Edit Wallet Address
          </button>
        </div>
      )}

      <ProfileModal
        setShowPopup={setShowPopup}
        showPopup={showPopup}
        emailAddress={userProfile?.email}
        runfetch={fetchProfile}
        buttonLoader={buttonLoader}
        setButtonLoader={setButtonLoader}
      />
    </DashboardLayout>
  );
};

export default Profile;
