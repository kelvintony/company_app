import React, { useState, useRef, useEffect } from 'react';
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
import { AiFillLock } from 'react-icons/ai';

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
    const res = await axios.get('/api/admin/game');
    try {
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
    const res = await axios.get(`/api/customers/game/?gameId=${gameId}`);

    try {
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
    setTradeGameLoading(true);
    const res = await axios.post('/api/customers/game', { gameInfo });
    try {
      if (res) {
        setTradeGameLoading(false);
        fetchTradedGame();
      }
    } catch (error) {
      setTradeGameLoading(false);
      console.log(error);
    }
  };
  // console.log('traded Game', tradedGame);
  return (
    <DashboardLayout>
      <>
        <div className={styles.section_a}>
          {state?.user?.fullName && <h3>Hello {state?.user?.fullName}!</h3>}
          <div className={styles.dashboard_container}>
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
                        Hide stats <FiArrowUp />
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
                        Show stats <FiArrowDown />
                      </span>
                    )}
                  </p>
                  <div
                    className={`${styles.computation_container} ${
                      showStats ? styles.show_container : styles.hide_container
                    }`}
                  >
                    <div className={styles.computation_wrapper}>
                      <div className={styles.wrapper_innera}>
                        <p
                          style={{
                            fontWeight: '700',
                          }}
                          className={styles.event_right}
                        >
                          Event 1:
                        </p>
                        <p
                          style={{
                            fontWeight: '600',
                            borderBottom: '1px solid gray',
                            color: '#0fd46c',
                          }}
                          className={styles.event_right}
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
                          className={styles.event_left}
                        >
                          Event 2:
                        </p>
                        <p
                          style={{
                            fontWeight: '600',
                            borderBottom: '1px solid gray',
                            color: '#0fd46c',
                          }}
                          className={styles.event_left}
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
                          <p className={styles.event_right}>
                            Total equity: <br /> &#36;
                            {
                              tradedGame?.eventOneStats?.totalEquity
                                ?.$numberDecimal
                            }
                          </p>
                        </div>
                        <div className={styles.wrapper_innerb}>
                          <p className={styles.event_left}>
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
                          <p className={styles.event_right}>
                            Expected returns: <br /> &#36;
                            {
                              tradedGame?.eventOneStats?.expectedReturns
                                ?.$numberDecimal
                            }
                          </p>
                        </div>
                        <div className={styles.wrapper_innerb}>
                          <p className={styles.event_left}>
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
                          <p className={styles.event_right}>
                            Event RO1: <br /> &#36;
                            {
                              tradedGame?.eventOneStats?.eventRoi
                                ?.$numberDecimal
                            }
                          </p>
                        </div>
                        <div className={styles.wrapper_innerb}>
                          <p className={styles.event_left}>
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
                      <AiFillLock size={19} />
                    </h3>
                  ) : tradedGame?.isGameTraded ? (
                    <h3 className={styles.staked_trade}>
                      Trade already placed
                      <AiFillLock size={19} />
                    </h3>
                  ) : (
                    <button
                      onClick={tradeNow}
                      disabled={tradeGameLoading}
                      className={styles.btn_stake}
                    >
                      {tradeGameLoading ? <SiginLoader /> : 'Trade Now'}
                    </button>
                  )}

                  {gameInfo?.eventMode === 'running' ? (
                    <h3 className={styles.staked_trade}>
                      Trade is running!
                      <AiFillLock size={19} />
                    </h3>
                  ) : gameInfo?.eventMode === 'cancelled' ? (
                    <h3 className={styles.staked_trade}>
                      Trade has been cancelled!
                      <AiFillLock size={19} />
                    </h3>
                  ) : gameInfo?.eventMode === 'completed' ? (
                    <h3 className={styles.staked_trade}>
                      Trade is completed!
                      <AiFillLock size={19} />
                    </h3>
                  ) : null}
                </div>
              </div>
            </div>
            <div className={styles.right_panel}>
              <p>Financial Analytics</p>
              <p>
                Total Balance: &#36;
                {convertWalletBalance(
                  state?.userTransactionProfile?.accountBalance?.$numberDecimal
                )}{' '}
              </p>
              <p>
                Equity: &#36;
                {convertWalletBalance(
                  state?.userTransactionProfile?.equity?.$numberDecimal
                )}{' '}
              </p>
              <p>
                ROI: &#36;
                {convertWalletBalance(
                  state?.userTransactionProfile?.roi?.$numberDecimal
                )}{' '}
              </p>
              <p>
                Withdrawable Balance: &#36;
                {convertWalletBalance(
                  state?.userTransactionProfile?.withdrawableBalance
                    ?.$numberDecimal
                )}{' '}
              </p>
            </div>
          </div>
        </div>
      </>
    </DashboardLayout>
  );
};

export default UserDashboard;
