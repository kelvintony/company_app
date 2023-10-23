import React from 'react';
import styles from './dashboard.module.css';
import DashboardLayout from '../../../components/DashBoardLayout/DashboardLayout';
import { BsPersonCircle } from 'react-icons/bs';
import { useEffect, useState } from 'react';
import axios from 'axios';
import UserLoader from '../../../components/UserLoader/UserLoader';
import ProfileModal from '../../../components/ProfileModal/ProfileModal';

import { BiCopy } from 'react-icons/bi';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { AlertHandler } from '../../../utils/AlertHandler';

const Profile = () => {
  const [userProfile, setUserProfile] = useState(null);

  const [showPopup, setShowPopup] = useState(false);

  const [buttonLoader, setButtonLoader] = useState(false);

  const [open, setOpen] = useState(false);

  const [responseMessage, setResponseMessage] = useState(null);

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

  const handleCopy = () => {
    setOpen(true); // make sure you set this guy open
    setResponseMessage('Wallet Address copied');
  };
  return (
    <DashboardLayout>
      <AlertHandler
        errorMessage={null}
        setOpen={setOpen}
        open={open}
        responseMessage={responseMessage}
      />
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
            <p>
              Wallet Address:{' '}
              <span style={{ fontSize: '14px' }}> USDT (TRC-20)</span>{' '}
            </p>
            <p>
              {userProfile?.walletAddress}{' '}
              <CopyToClipboard
                text={userProfile?.walletAddress}
                onCopy={handleCopy}
              >
                <button className={styles.btn_copy}>
                  Copy <BiCopy />
                </button>
              </CopyToClipboard>
            </p>
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
