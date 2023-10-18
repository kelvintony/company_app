import Link from 'next/link';
import styles from './Dashboard.module.css';
import { BsBell, BsJournalRichtext } from 'react-icons/bs';
import { RiLuggageDepositLine, RiMenu3Line } from 'react-icons/ri';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { RiAdminLine } from 'react-icons/ri';
import React, { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import Cookies from 'js-cookie';
import { useStore } from '../../context';
import { authConstants } from '../../context/constants';
import axios from 'axios';
import { MdOutlineWorkHistory, MdRefresh } from 'react-icons/md';
import { BalanceLoader } from '../BalanceLoader/BalanceLoader';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import convertWalletBalance from '../../utils/convertWalletBalance';
import { AiOutlineLogout } from 'react-icons/ai';
import { LuLayoutDashboard } from 'react-icons/lu';
import { VscAccount } from 'react-icons/vsc';
import { FaHandHoldingDollar } from 'react-icons/fa6';
import { GiMoneyStack, GiReceiveMoney } from 'react-icons/gi';

const menuItems = [
  {
    id: 'dasboard',
    url: '/user/dashboard',
    menuName: 'Trade',
    // iconsType: <LuLayoutDashboard />,
    iconsType: <FaHandHoldingDollar />,
  },
  {
    id: 'profile',
    url: '/user/profile',
    menuName: 'Profile',
    // iconsType: <MdOutlineAccountCircle />,
    iconsType: <VscAccount />,
  },
  {
    id: 'withdraw',
    url: '/user/withdraw',
    menuName: 'Withdraw',
    iconsType: <GiMoneyStack />,
  },
  {
    id: 'deposit',
    url: '/user/deposit',
    menuName: 'Deposit',
    iconsType: <RiLuggageDepositLine />,
  },
  {
    id: 'transaction',
    url: '/user/transactions',
    menuName: 'Transactions',
    iconsType: <BsJournalRichtext />,
  },
  {
    id: 'accounthistory',
    url: '/user/account-history',
    menuName: 'Account History',
    iconsType: <MdOutlineWorkHistory />,
  },
];
const Dashboard = ({ children }) => {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  const [state, dispatch] = useStore();

  const { status, data: session } = useSession();

  const [loadBalance, setLoadBalance] = useState(false);

  console.log('dashboard Layout ran');

  // console.log('from dashboard', state?.userTransactionProfile);

  useEffect(() => {
    const fetchUserTransaction = async () => {
      // dispatch({ type: authConstants.FETCH_USER_TRANSACTION_DETAILS_REQUEST });
      try {
        const res = await axios.get('/api/customers/user-wallet-profile');
        if (res) {
          dispatch({
            type: authConstants.FETCH_USER_TRANSACTION_DETAILS,
            payload: res.data,
          });
        }
      } catch (error) {
        console.log('');
      }
    };
    fetchUserTransaction();
  }, [dispatch]);

  const fetchUserTransaction = async () => {
    setLoadBalance(true);
    try {
      const res = await axios.get('/api/customers/user-wallet-profile');
      if (res) {
        setLoadBalance(false);

        dispatch({
          type: authConstants.FETCH_USER_TRANSACTION_DETAILS,
          payload: res.data,
        });
      }
    } catch (error) {
      setLoadBalance(false);

      console.log(error);
    }
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const closeMenu = () => {
    setShowMenu(false);
  };

  const toggle = () => {
    router.push('/user/dashboard/#payments');
  };

  const logoutClickHandler = () => {
    Cookies.remove('next-auth.csrf-token');
    Cookies.remove('next-auth.session-token');
    signOut({ callbackUrl: '/' });
    // Cookies.clear();
  };

  return (
    <div className={styles.dashboard_container}>
      {/* ist content  */}
      <div className={styles.dashboard_topBar}>
        <div className={styles.site_message}>
          <h3>Announcement!!</h3>
          <p>We have a bonus coming up by 11:30pm today, be ready!</p>
        </div>
        <RiMenu3Line onClick={toggleMenu} className={styles.mobile_men_close} />
      </div>

      <div className={`${styles.dashboard_topBar} ${styles.extra_menu}`}>
        <div className={`${styles.user_info} ${styles.margin_top}`}>
          {state?.user?.fullName && (
            <h4 onClick={() => router.push('/user/profile')}>
              {state?.user?.fullName.slice(0, 2)}
            </h4>
          )}
          <div className={styles.user_balance}>
            <p className={styles.user_name}>{state?.user?.fullName}</p>
            <p
              className={styles.user_balance}
              style={{ display: 'flex', gap: '5px', alignItems: 'center' }}
            >
              {state?.userTransactionProfile?.loading && <BalanceLoader />}
              <>
                &#36;
                {/* {state?.userTransactionProfile?.accountBalance?.$numberDecimal?.toLocaleString()} */}
                {convertWalletBalance(
                  state?.userTransactionProfile?.accountBalance?.$numberDecimal
                )}
              </>

              {''}
              {loadBalance ? (
                <BalanceLoader />
              ) : (
                <MdRefresh
                  onClick={fetchUserTransaction}
                  size={20}
                  style={{ cursor: 'pointer' }}
                />
              )}
            </p>
          </div>
        </div>
        <div className={styles.notify_container}>
          <div className={styles.red_dot}>2</div>
          <BsBell size={25} className={styles.bell_icon} />
        </div>
        <div className={styles.open_menu_container}>
          <RiMenu3Line
            onClick={toggleMenu}
            className={styles.mobile_men_close}
          />
        </div>
      </div>

      {/* second content  */}
      <div
        className={`${styles.left_sideBar} ${
          showMenu ? styles.active : styles.inactive
        }`}
      >
        <div className={styles.leftbar__inner}>
          <IoIosCloseCircleOutline
            onClick={toggleMenu}
            className={styles.mobile_men}
          />
          <div className={styles.user_info}>
            {state?.user?.fullName && (
              <h4 onClick={() => router.push('/user/profile')}>
                {state?.user?.fullName.slice(0, 2)}
              </h4>
            )}
            {/* state?.userTransactionProfile?.loading */}
            <div className={styles.user_balance}>
              <p>{state?.user?.fullName}</p>
              <p style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                {state?.userTransactionProfile?.loading && <BalanceLoader />}
                <>
                  &#36;
                  {/* {state?.userTransactionProfile?.accountBalance?.$numberDecimal?.toLocaleString()} */}
                  {convertWalletBalance(
                    state?.userTransactionProfile?.accountBalance
                      ?.$numberDecimal
                  )}{' '}
                </>
                {''}
                {loadBalance ? (
                  <BalanceLoader />
                ) : (
                  <MdRefresh
                    onClick={fetchUserTransaction}
                    size={20}
                    style={{ cursor: 'pointer' }}
                  />
                )}
              </p>
            </div>
          </div>
          <div className={styles.divider}></div>

          <div className={styles.dashboard_menus}>
            {menuItems.map((item) => {
              return (
                <Link
                  onClick={closeMenu}
                  key={item.id}
                  className={
                    router.pathname === item.url
                      ? styles.menu_items_active
                      : styles.menu_items
                  }
                  href={item.url}
                >
                  <span className={styles.item_icon}>{item.iconsType}</span>
                  {item.menuName}
                </Link>
              );
            })}
            {session?.user?.superUser === true && (
              <button
                onClick={() => router.push('/user/admin')}
                className={
                  router.pathname === '/user/admin'
                    ? styles.menu_items_active
                    : styles.user_admin
                }
              >
                <RiAdminLine className={styles.item_icon} />
                Admin
              </button>
            )}
            <button onClick={logoutClickHandler} className={styles.user_logout}>
              <AiOutlineLogout className={styles.logout_icon} />
              Log out
            </button>
          </div>
        </div>
      </div>

      {/* 3rd content  */}
      <div className={styles.main_content}>
        {/* <div className={styles.quick_nav}>
          <button
            onClick={() => router.push('/user/category/data')}
            className={styles.quick_nav_button}
          >
            Buy Data
          </button>
          <button
            onClick={() => router.push('/user/category/airtime')}
            className={styles.quick_nav_button}
          >
            Buy Airtime
          </button>
          <button
            onClick={() => router.push('/user/transactions')}
            className={styles.quick_nav_button}
          >
            Transactions
          </button>
          {state?.userTransactionProfile?.accountType === 'reseller' ? (
            <p className={styles.account_type}>
              Account Type: <span>Reseller</span>
            </p>
          ) : state?.userTransactionProfile?.accountType === 'customer' ? (
            <Link
              className={styles.btn_upgradeNow}
              href='/user/upgrade-account'
            >
              Upgrade account to enjoy cheaper data
            </Link>
          ) : null}
        </div> */}

        <div>{children}</div>
      </div>

      {/* bottom bar  */}
      <div className={styles.dashboard_bottomBar}>
        <button
          onClick={() => router.push('/user/dashboard')}
          className={
            router.pathname === '/user/dashboard' ? styles.active_link : ''
          }
        >
          <FaHandHoldingDollar className={styles.bottom_bar_icon} /> Trade
        </button>
        <button
          onClick={() => router.push('/user/profile')}
          className={
            router.pathname === '/user/profile' ? styles.active_link : ''
          }
        >
          <VscAccount className={styles.bottom_bar_icon} /> Profile
        </button>
        <button
          onClick={() => router.push('/user/withdraw')}
          className={
            router.pathname === '/user/withdraw' ? styles.active_link : ''
          }
        >
          <GiMoneyStack className={styles.bottom_bar_icon} /> Withdraw
        </button>
        <button
          onClick={() => router.push('/user/deposit')}
          className={
            router.pathname === '/user/deposit' ? styles.active_link : ''
          }
        >
          <RiLuggageDepositLine className={styles.bottom_bar_icon} /> Deposit
        </button>
        <button
          onClick={() => router.push('/user/transactions')}
          className={
            router.pathname === '/user/transactions' ? styles.active_link : ''
          }
        >
          <BsJournalRichtext className={styles.bottom_bar_icon} />
          Transactions
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
