import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/DashBoardLayout/DashboardLayout';
import styles from './dashboard.module.css';
import Image from 'next/image';
import { authConstants } from '../../../context/constants';
import convertWalletBalance from '../../../utils/convertWalletBalance';

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useStore } from '../../../context';

import { FiArrowDown } from 'react-icons/fi';
import { FiArrowUp } from 'react-icons/fi';
import splitText from '../../../utils/splitText';
import SiginLoader from '../../../components/SigninLoader/SiginLoader';
import {
  AiFillLock,
  AiFillWarning,
  AiOutlineCheckCircle,
  AiOutlineClockCircle,
} from 'react-icons/ai';
import UserLoader from '../../../components/UserLoader/UserLoader';

import { AlertHandler } from '../../../utils/AlertHandler';
import { BsCashCoin, BsGraphUpArrow } from 'react-icons/bs';
import { GiCash } from 'react-icons/gi';

const UserDashboard = () => {
  const router = useRouter();

  const { status, data: session } = useSession();

  const { asPath, pathname } = useRouter();

  const [state, dispatch] = useStore();

  const searchParams = useSearchParams();

  const reference = searchParams.get('reference');

  const [showStats, setShowStats] = useState(false);

  const [gameInfo, setGameInfo] = useState(null);

  const [tradedGame, setTradedGame] = useState(null);

  const [loadGameData, setLoadGameData] = useState(false);
  const [tradeGameLoading, setTradeGameLoading] = useState(false);
  const [fetchTradeGameLoading, seFetchTradeGameLoading] = useState(false);

  //! ALERT SECTION
  const [errorMessage, setErrorMessage] = useState(null);
  const [open, setOpen] = useState(false);
  //! THE END OF ALERT SECTION

  useEffect(() => {
    fetchGame();
  }, []);

  useEffect(() => {
    gameInfo && fetchTradedGame();
  }, [gameInfo]);

  const toggleStats = () => {
    setShowStats(!showStats);
  };

  const fetchGame = async () => {
    setLoadGameData(true);
    try {
      const res = await axios.get('/api/admin/game');
      if (res) {
        setLoadGameData(false);
        setGameInfo(res.data.message);
      }
    } catch (error) {
      setLoadGameData(false);
      console.log(error);
    }
  };

  const fetchTradedGame = async () => {
    seFetchTradeGameLoading(true);
    const gameId = gameInfo?._id;

    try {
      const res = await axios.get(`/api/customers/game/?gameId=${gameId}`);
      if (res) {
        seFetchTradeGameLoading(false);
        setTradedGame(res?.data?.message[0]);
      }
    } catch (error) {
      seFetchTradeGameLoading(false);
      console.log(error);
    }
  };

  const tradeNow = async () => {
    setErrorMessage(null);
    setTradeGameLoading(true);
    setOpen(true); //! make sure you set this guy open for the MUI alert

    try {
      const res = await axios.post('/api/customers/game', { gameInfo });
      const res2 = await axios.get('/api/customers/user-wallet-profile');

      if (res) {
        setTradeGameLoading(false);
        fetchTradedGame();
        dispatch({
          type: authConstants.FETCH_USER_TRANSACTION_DETAILS,
          payload: res2.data,
        });
      }
    } catch (error) {
      setTradeGameLoading(false);
      setErrorMessage(error?.response?.data?.message);
      console.log(error);
    }
  };
  return (
    <DashboardLayout>
      <>
        <AlertHandler
          errorMessage={errorMessage}
          open={open}
          setOpen={setOpen}
          responseMessage={null}
        />

        <div className={styles.section_a}>
          {state?.user?.fullName && <h3>Hello {state?.user?.fullName}!</h3>}
          <div className={styles.dashboard_container}>
            {!gameInfo && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: '20px',
                }}
              >
                <UserLoader />
              </div>
            )}
            {gameInfo && (
              <div className={styles.left_panel}>
                <div className={styles.profit_target}>
                  <p>29.98%</p>
                  <p>Profit target for this month</p>
                </div>

                <div className={styles.match_event}>
                  <p>
                    {gameInfo?.eventType.length > 0
                      ? gameInfo?.eventType
                      : '*****'}
                  </p>
                  <p style={{ lineHeight: '2.3rem', margin: '20px 0px' }}>
                    {' '}
                    {gameInfo?.eventSelection.length > 0
                      ? splitText(gameInfo.eventSelection)?.textBeforeVS
                      : '********'}
                    <br /> {gameInfo?.eventSelection.length > 0 ? 'VS' : '***'}
                    <br />
                    {gameInfo?.eventSelection.length > 0
                      ? splitText(gameInfo.eventSelection)?.textAfterVS
                      : '********'}
                  </p>
                  <p>
                    {gameInfo?.eventTime.length > 0
                      ? gameInfo?.eventTime
                      : '****'}{' '}
                    GMT+1 <br />{' '}
                    <span style={{ fontSize: '14px' }}>
                      {gameInfo?.eventDate.length > 0
                        ? gameInfo?.eventDate
                        : '*******'}
                    </span>
                  </p>

                  <div className={styles.event_computations}>
                    <p onClick={toggleStats}>
                      {showStats ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            fontSize: '14px',
                            gap: '5px',
                            color: '#0fd46c',
                          }}
                        >
                          Hide details <FiArrowUp />
                        </span>
                      ) : (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            fontSize: '14px',
                            gap: '5px',
                            color: '#0fd46c',
                          }}
                        >
                          Show details <FiArrowDown />
                        </span>
                      )}
                    </p>
                    <div
                      className={`${styles.computation_container} ${
                        showStats
                          ? styles.show_container
                          : styles.hide_container
                      }`}
                    >
                      <div className={styles.computation_wrapper}>
                        <div className={styles.wrapper_innera}>
                          <p
                            style={{
                              fontWeight: '700',
                            }}
                            className={`${styles.event_right} ${
                              gameInfo?.concludedEvent === 'event 1'
                                ? styles.success_trade_color
                                : ''
                            }`}
                          >
                            Outcome 1:
                          </p>
                          <p
                            style={{
                              fontWeight: '600',
                              borderBottom: '1px solid gray',
                            }}
                            className={`${styles.event_right} ${
                              gameInfo?.concludedEvent === 'event 1'
                                ? styles.success_trade_color
                                : ''
                            }`}
                          >
                            {gameInfo?.eventOption1.length > 0
                              ? `${gameInfo?.eventOption1} - ${gameInfo?.eventOption1Odd?.$numberDecimal}`
                              : '*******'}
                          </p>
                        </div>
                        <div className={styles.wrapper_innerb}>
                          <p
                            style={{
                              fontWeight: '700',
                            }}
                            className={`${styles.event_left} ${
                              gameInfo?.concludedEvent === 'event 2'
                                ? styles.success_trade_color
                                : ''
                            }`}
                          >
                            Outcome 2:
                          </p>
                          <p
                            style={{
                              fontWeight: '600',
                              borderBottom: '1px solid gray',
                              // color: '#0fd46c',
                            }}
                            className={`${styles.event_left} ${
                              gameInfo?.concludedEvent === 'event 2'
                                ? styles.success_trade_color
                                : ''
                            }`}
                          >
                            {gameInfo?.eventOption2.length > 0
                              ? `${gameInfo?.eventOption2} - ${gameInfo?.eventOption2Odd?.$numberDecimal}`
                              : '*******'}
                          </p>
                        </div>
                      </div>

                      {tradedGame && (
                        <div className={styles.computation_wrapper}>
                          <div className={styles.wrapper_innera}>
                            <p
                              className={`${styles.event_right} ${
                                gameInfo?.concludedEvent === 'event 1'
                                  ? styles.success_trade_color
                                  : ''
                              }`}
                            >
                              Total equity: <br /> &#36;
                              {
                                tradedGame?.eventOneStats?.totalEquity
                                  ?.$numberDecimal
                              }
                            </p>
                          </div>
                          <div className={styles.wrapper_innerb}>
                            <p
                              className={`${styles.event_left} ${
                                gameInfo?.concludedEvent === 'event 2'
                                  ? styles.success_trade_color
                                  : ''
                              }`}
                            >
                              {' '}
                              Total equity: <br /> &#36;
                              {
                                tradedGame?.eventTwoStats?.totalEquity
                                  ?.$numberDecimal
                              }
                            </p>
                          </div>
                        </div>
                      )}
                      {tradedGame && (
                        <div className={styles.computation_wrapper}>
                          <div className={styles.wrapper_innera}>
                            <p
                              className={`${styles.event_right} ${
                                gameInfo?.concludedEvent === 'event 1'
                                  ? styles.success_trade_color
                                  : ''
                              }`}
                            >
                              Expected returns: <br /> &#36;
                              {
                                tradedGame?.eventOneStats?.expectedReturns
                                  ?.$numberDecimal
                              }
                            </p>
                          </div>
                          <div className={styles.wrapper_innerb}>
                            <p
                              className={`${styles.event_left} ${
                                gameInfo?.concludedEvent === 'event 2'
                                  ? styles.success_trade_color
                                  : ''
                              }`}
                            >
                              Expected returns: <br /> &#36;
                              {
                                tradedGame?.eventTwoStats?.expectedReturns
                                  ?.$numberDecimal
                              }
                            </p>
                          </div>
                        </div>
                      )}
                      {tradedGame && (
                        <div className={styles.computation_wrapper}>
                          <div className={styles.wrapper_innera}>
                            <p
                              className={`${styles.event_right} ${
                                gameInfo?.concludedEvent === 'event 1'
                                  ? styles.success_trade_color
                                  : ''
                              }`}
                            >
                              Event RO1: <br /> &#36;
                              {
                                tradedGame?.eventOneStats?.eventRoi
                                  ?.$numberDecimal
                              }
                            </p>
                          </div>
                          <div className={styles.wrapper_innerb}>
                            <p
                              className={`${styles.event_left} ${
                                gameInfo?.concludedEvent === 'event 2'
                                  ? styles.success_trade_color
                                  : ''
                              }`}
                            >
                              Event RO1: <br /> &#36;
                              {
                                tradedGame?.eventTwoStats?.eventRoi
                                  ?.$numberDecimal
                              }
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {gameInfo?.status?.locked ? (
                      <h3 className={styles.staked_trade}>
                        Trade not yet active
                        <AiFillLock size={16} />
                      </h3>
                    ) : tradedGame?.isGameTraded ? (
                      <h3 className={styles.staked_trade}>
                        Trade already placed
                        <AiFillLock size={16} />
                      </h3>
                    ) : null}

                    {!(
                      gameInfo?.eventMode === 'running' ||
                      gameInfo?.eventMode === 'cancelled' ||
                      gameInfo?.eventMode === 'completed' ||
                      gameInfo?.status?.locked ||
                      tradedGame?.isGameTraded
                    ) && (
                      <button
                        onClick={tradeNow}
                        disabled={tradeGameLoading}
                        className={
                          loadGameData
                            ? styles.hide_stake_button
                            : styles.btn_stake
                        }
                      >
                        {tradeGameLoading ? <SiginLoader /> : 'Trade Now'}
                      </button>
                    )}

                    <div></div>

                    {gameInfo?.eventMode === 'running' ? (
                      <h3 className={styles.staked_trade}>
                        Trade is running!
                        <AiOutlineClockCircle size={16} />
                      </h3>
                    ) : gameInfo?.eventMode === 'cancelled' ? (
                      <h3
                        className={`${styles.staked_trade} ${styles.staked_trade_cancelled}`}
                      >
                        Trade has been cancelled!
                        <AiFillWarning size={16} />
                      </h3>
                    ) : gameInfo?.eventMode === 'completed' ? (
                      <h3
                        className={`${styles.staked_trade} ${styles.staked_trade_completed}`}
                      >
                        Trade is completed!
                        <AiOutlineCheckCircle size={16} />
                      </h3>
                    ) : null}
                  </div>
                </div>
              </div>
            )}
            <div className={styles.right_panel}>
              <p>Financial Analytics</p>
              <div className={styles.inner_wrapper}>
                <div className={`${styles.account_container} ${styles.panel1}`}>
                  <div className={styles.icon_container}>
                    <GiCash className={styles.amount_icon} />
                  </div>
                  <div className={styles.inner}>
                    <p>
                      Total Balance
                      <br />
                      <span>
                        &#36;
                        {convertWalletBalance(
                          state?.userTransactionProfile?.accountBalance
                            ?.$numberDecimal
                        )}{' '}
                      </span>
                    </p>
                  </div>
                </div>
                <div className={`${styles.account_container} ${styles.panel2}`}>
                  <div className={styles.icon_container}>
                    <GiCash className={styles.amount_icon} />
                  </div>
                  <div className={styles.inner}>
                    <p>
                      Equity
                      <br />
                      <span>
                        &#36;
                        {convertWalletBalance(
                          state?.userTransactionProfile?.equity?.$numberDecimal
                        )}{' '}
                      </span>
                    </p>
                  </div>
                </div>
                <div className={`${styles.account_container} ${styles.panel3}`}>
                  <div className={styles.icon_container}>
                    <BsGraphUpArrow className={styles.amount_icon} />
                  </div>
                  <div className={styles.inner}>
                    <p>
                      ROI
                      <br />
                      <span>
                        &#36;
                        {convertWalletBalance(
                          state?.userTransactionProfile?.roi?.$numberDecimal
                        )}{' '}
                      </span>
                    </p>
                  </div>
                </div>
                <div className={`${styles.account_container} ${styles.panel4}`}>
                  <div className={styles.icon_container}>
                    <GiCash className={styles.amount_icon} />
                  </div>
                  <div className={styles.inner}>
                    <p>
                      Withdrawable Balance
                      <br />
                      <span>
                        &#36;
                        {convertWalletBalance(
                          state?.userTransactionProfile?.withdrawableBalance
                            ?.$numberDecimal
                        )}{' '}
                      </span>
                    </p>
                  </div>
                </div>
                <div className={`${styles.account_container} ${styles.panel5}`}>
                  <div className={styles.icon_container}>
                    <BsCashCoin className={styles.amount_icon} />
                  </div>
                  <div className={styles.inner}>
                    <p>
                      Referral Bonus
                      <br />
                      <span>
                        &#36;
                        {convertWalletBalance(
                          state?.userTransactionProfile?.referralBonus
                            ?.$numberDecimal
                        )}{' '}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </DashboardLayout>
  );
};

export default UserDashboard;
