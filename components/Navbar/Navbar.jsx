import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from './Navbar.module.css';
import Image from 'next/image';
import dataLogo from '../../assets/datafarm.svg';

import { getSession, signOut, useSession } from 'next-auth/react';
import { useStore } from '../../context';
import Cookies from 'js-cookie';
import { authConstants } from '../../context/constants';

import { RiMenu3Line } from 'react-icons/ri';
import {
  IoIosCloseCircleOutline,
  IoMdArrowDropdown,
  IoMdArrowDropup,
} from 'react-icons/io';
import LogoItem from '../LogoItem/LogoItem';
import { FiLogOut } from 'react-icons/fi';
import {
  NavbarDropDownDesktop,
  NavbarDropDownMobile,
} from './NavbarDropDown/NavbarDropDown';
import UserLoader from '../UserLoader/UserLoader';

const Navbar = () => {
  const router = useRouter();
  const { status, data: session } = useSession();

  const [state, dispatch] = useStore();

  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };
  const closeMenu = () => {
    setShowMenu(false);
  };

  const loginHandler = () => {
    router.push('/auth/login');
  };
  const registerHandler = () => {
    router.push('/auth/register');
  };

  const logoutClickHandler = () => {
    Cookies.remove('next-auth.csrf-token');
    Cookies.remove('next-auth.session-token');
    signOut({ callbackUrl: '/' });
  };
  // console.log('from Navbar session', session);
  // console.log('from Navbar state', state);
  // console.log('is he auth', status);

  return (
    <div className={styles.navbar_wrapper}>
      <div className={styles.navbar_container}>
        <div
          onClick={() => router.push('/')}
          className={styles.logo_item_container}
        >
          <LogoItem />
        </div>

        <div className={styles.navbar_elements}>
          <div className={styles.nav_menu_items}>
            <Link className={styles.navbar_items} href='/'>
              Home
            </Link>
            <Link className={styles.navbar_items} href='/reach-us'>
              Reach Us
            </Link>
            <Link className={styles.navbar_items} href='/about-us'>
              About Us
            </Link>
            {status === 'unauthenticated' && (
              <div className={styles.btn_container}>
                <Link
                  className={`${styles.navbar_items} ${styles.btn_login}`}
                  href='/auth/login'
                >
                  Login
                </Link>
                <Link
                  className={`${styles.navbar_items} ${styles.btn_register}`}
                  href='/auth/register'
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {state?.user?.authenticated ? (
            <NavbarDropDownDesktop
              status={status}
              session={session}
              state={state}
              logoutClickHandler={logoutClickHandler}
            />
          ) : status === 'unauthenticated' ? (
            <button
              onClick={loginHandler}
              className={`${styles.btn_login} ${styles.menu_for_mobile}`}
            >
              Login
            </button>
          ) : null}
          {status === 'unauthenticated' && (
            <button onClick={toggleMenu} className={styles.menu_icon}>
              <RiMenu3Line size={35} />
            </button>
          )}
        </div>

        {/* mobile menu  */}
        <div
          className={`${styles.mobile_menu} ${
            showMenu ? styles.active : styles.inactive
          }`}
        >
          <Link onClick={closeMenu} className={styles.navbar_items} href='/'>
            Home
          </Link>
          <Link
            onClick={closeMenu}
            className={styles.navbar_items}
            href='/reach-us'
          >
            Reach Us
          </Link>
          <Link
            onClick={closeMenu}
            className={styles.navbar_items}
            href='/about-us'
          >
            About Us
          </Link>
        </div>
        {status === 'unauthenticated' && (
          <div
            className={`${styles.getStarted} ${
              showMenu ? styles.active : styles.inactive
            }`}
            // className={styles.getStarted}
          >
            <button onClick={loginHandler} className={styles.btn_login}>
              Login
            </button>
            <button onClick={registerHandler} className={styles.btn_register}>
              Register
            </button>
          </div>
        )}

        {showMenu && (
          <button onClick={closeMenu} className={styles.menu_close_icon}>
            <IoIosCloseCircleOutline />
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
