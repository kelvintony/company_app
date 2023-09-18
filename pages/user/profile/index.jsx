import React from 'react';
import styles from './dashboard.module.css';
import DashboardLayout from '../../../components/DashBoardLayout/DashboardLayout';
import { BsPersonCircle } from 'react-icons/bs';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const [userProfile, setUserProfile] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/api/customers/profile-details');
        console.log('from profile', res);
        if (res) {
          setUserProfile(res.data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchProfile();
  }, []);
  console.log(userProfile);
  return (
    <DashboardLayout>
      <h3 className={styles.header}>
        Profile Details
        <BsPersonCircle className={styles.comming_soon_icon} />
      </h3>

      <div className={styles.profile_container}>
        <div className={styles.profile_items}>
          <p>Full Name:</p>
          <p>{userProfile?.fullName}</p>
        </div>
        <div className={styles.profile_items}>
          <p>Email:</p>
          <p>{userProfile?.email}</p>
        </div>

        {/* <div className={styles.profile_items}>
          <p>Phone Number:</p>
          <p>09064484416</p>
        </div> */}

        <div className={styles.profile_items}>
          <p>Wallet Address:</p>
          <p>USDT - {userProfile.walletAddress}</p>
        </div>

        <button className={styles.edit_wallet}>Edit Wallet Adress</button>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
