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

const UserDashboard = () => {
  const router = useRouter();

  const { status, data: session } = useSession();

  const { asPath, pathname } = useRouter();

  const [state, dispatch] = useStore();

  const searchParams = useSearchParams();

  const reference = searchParams.get('reference');

  const [showStats, setShowStats] = useState(false);

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
                <p>Football</p>
                <p>BURNLEY VS MANCHESTER CITY</p>
                <p>
                  20:00 GMT+1 <br />{' '}
                  <span style={{ fontSize: '14px' }}>11th Jun, 2023</span>
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
                        <p>Event 1</p>
                        <p>0v2.5</p>
                      </div>
                      <div className={styles.wrapper_innerb}>
                        <p>Event 2</p>
                        <p>Un2.5</p>
                      </div>
                    </div>
                    <div className={styles.computation_wrapper}>
                      <div className={styles.wrapper_innera}>
                        <p>Total equity: &#36;512.2</p>
                      </div>
                      <div className={styles.wrapper_innerb}>
                        <p>Total equity: &#36;487.8</p>
                      </div>
                    </div>
                    <div className={styles.computation_wrapper}>
                      <div className={styles.wrapper_innera}>
                        <p>Expected returns: &#36;1,010</p>
                      </div>
                      <div className={styles.wrapper_innerb}>
                        <p>Expected returns: &#36;1,010</p>
                      </div>
                    </div>
                    <div className={styles.computation_wrapper}>
                      <div className={styles.wrapper_innera}>
                        <p>Event RO1: &#36;910</p>
                      </div>
                      <div className={styles.wrapper_innerb}>
                        <p>Event RO1: &#36;910</p>
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
