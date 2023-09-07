import Link from 'next/link';
import React, { useState } from 'react';
import styles from './NavbarDropDown.module.css';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { FiLogOut } from 'react-icons/fi';

const NavbarDropDownDesktop = ({
  status,
  session,
  state,
  logoutClickHandler,
}) => {
  const [showDashboard, setShowDashboard] = useState(false);

  const toggleDashboard = () => {
    setShowDashboard(!showDashboard);
  };

  return (
    <>
      <div className={styles.profile_container}>
        <button onClick={toggleDashboard} className={styles.btn_profileImage}>
          {state?.user?.fullName?.charAt(0).toUpperCase()}
        </button>
        <button
          style={{
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#fff',
          }}
          onClick={toggleDashboard}
        >
          {!showDashboard ? (
            <IoMdArrowDropdown size={25} />
          ) : (
            <IoMdArrowDropup size={25} />
          )}
        </button>
      </div>

      {status === 'authenticated' && (
        <div
          className={
            showDashboard ? styles.profile_dropdown : styles.close_profileMenu
          }
        >
          <ul>
            <li>
              <h3 className={styles.profile_Name}>{state?.user?.fullName}</h3>
              <span className={styles.proile_userName}>
                @{state?.user?.fullName}
              </span>
            </li>
            <hr />
            <li onClick={toggleDashboard} className={styles.profileItems}>
              <Link style={{ display: 'block' }} href='/user/dashboard'>
                Dashboard
              </Link>
            </li>
            <li onClick={toggleDashboard} className={styles.profileItems}>
              <Link style={{ display: 'block' }} href='/user/transactions'>
                Transactions
              </Link>
            </li>

            <hr />

            {session?.user?.superUser === true && (
              <li onClick={toggleDashboard} className={styles.profileItems}>
                <Link style={{ display: 'block' }} href='/user/admin/'>
                  Admin Only
                </Link>
              </li>
            )}
            {session?.user?.superUser === true && (
              <li onClick={toggleDashboard} className={styles.profileItems}>
                <Link style={{ display: 'block' }} href='/user/admin/'>
                  Admin Settings
                </Link>
              </li>
            )}

            <hr />
            <li onClick={logoutClickHandler} className={styles.profileItems}>
              <button className={styles.user_logout}>
                <FiLogOut size={13} />
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export { NavbarDropDownDesktop };
