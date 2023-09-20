import React from 'react';
import Dashboard from '../../../components/DashBoardLayout/DashboardLayout';
import styles from './Admin.module.css';
import { FaSmile } from 'react-icons/fa';
import AdminTab from '../../../components/AdminComponents/AdminTab/AdminTab';

const Home = () => {
  return (
    <Dashboard>
      <h3 className={styles.header}>
        Welcome Admin
        <FaSmile className={styles.smile_icon} />
      </h3>
      <div className={styles.admin_tab_container}>
        <AdminTab />
      </div>
    </Dashboard>
  );
};

export default Home;
