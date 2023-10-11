import React, { useState, useRef, useEffect } from 'react';
import DashboardLayout from '../../../components/DashBoardLayout/DashboardLayout';
import styles from './dashboard.module.css';
import Image from 'next/image';
import { authConstants } from '../../../context/constants';

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useStore } from '../../../context';

import { FiArrowDown } from 'react-icons/fi';
import { FiArrowUp } from 'react-icons/fi';
import splitText from '../../../utils/splitText';

const UserDashboard = () => {
  const router = useRouter();

  const { status, data: session } = useSession();

  const { asPath, pathname } = useRouter();

  const [state, dispatch] = useStore();

  const searchParams = useSearchParams();

  const reference = searchParams.get('reference');

  const [showStats, setShowStats] = useState(false);

  const [gameInfo, setGameInfo] = useState(null);

  const [loadGameData, setLoadGameData] = useState(false);

  useEffect(() => {
    fetchDame();
  }, []);

  const fetchDame = async () => {
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

  const toggleStats = () => {
    setShowStats(!showStats);
  };

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
                            fontWeight: '700',
                            borderBottom: '1px solid gray',
                          }}
                          className={styles.event_right}
                        >
                          {gameInfo?.eventOption1.length > 0
                            ? gameInfo?.eventOption1
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
                            fontWeight: '700',
                            borderBottom: '1px solid gray',
                          }}
                          className={styles.event_left}
                        >
                          {gameInfo?.eventOption2.length > 0
                            ? gameInfo?.eventOption2
                            : '*******'}
                        </p>
                      </div>
                    </div>
                    <div className={styles.computation_wrapper}>
                      <div className={styles.wrapper_innera}>
                        <p className={styles.event_right}>
                          Total equity: <br /> &#36;512.2
                        </p>
                      </div>
                      <div className={styles.wrapper_innerb}>
                        <p className={styles.event_left}>
                          {' '}
                          Total equity: <br /> &#36;487.8
                        </p>
                      </div>
                    </div>
                    <div className={styles.computation_wrapper}>
                      <div className={styles.wrapper_innera}>
                        <p className={styles.event_right}>
                          Expected returns: <br /> &#36;1,010
                        </p>
                      </div>
                      <div className={styles.wrapper_innerb}>
                        <p className={styles.event_left}>
                          Expected returns: <br /> &#36;1,010
                        </p>
                      </div>
                    </div>
                    <div className={styles.computation_wrapper}>
                      <div className={styles.wrapper_innera}>
                        <p className={styles.event_right}>
                          Event RO1: <br /> &#36;910
                        </p>
                      </div>
                      <div className={styles.wrapper_innerb}>
                        <p className={styles.event_left}>
                          Event RO1: <br /> &#36;910
                        </p>
                      </div>
                    </div>
                  </div>

                  <button className={styles.btn_stake}>Trade Now</button>
                </div>
              </div>
            </div>
            <div className={styles.right_panel}>
              <p>Financial Analytics</p>
              <p>Total Balance: &#36;1,300 </p>
              <p>Equity: &#36;1,000 </p>
              <p>ROI: &#36;300 </p>
              <p>Withdrawable Balance: &#36;300 </p>
            </div>
          </div>
        </div>
      </>
    </DashboardLayout>
  );
};

export default UserDashboard;
