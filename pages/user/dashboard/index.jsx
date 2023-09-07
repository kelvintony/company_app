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

const UserDashboard = () => {
  const router = useRouter();

  const { status, data: session } = useSession();

  const { asPath, pathname } = useRouter();

  const [state, dispatch] = useStore();

  const searchParams = useSearchParams();

  const reference = searchParams.get('reference');

  return (
    <DashboardLayout>
      <>
        <div className={styles.section_a}>
          <h1>This is Dashboard</h1>
        </div>
      </>
    </DashboardLayout>
  );
};

export default UserDashboard;
