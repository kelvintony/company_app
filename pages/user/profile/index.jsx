import React from 'react';
import styles from './dashboard.module.css';
import DashboardLayout from '../../../components/DashBoardLayout/DashboardLayout';
import { BsPersonCircle } from 'react-icons/bs';
import { useEffect, useState } from 'react';
import axios from 'axios';
import UserLoader from '../../../components/UserLoader/UserLoader';

const Profile = () => {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
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

    fetchProfile();
  }, []);
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

          <button className={styles.edit_wallet}>Edit Wallet Address</button>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Profile;
