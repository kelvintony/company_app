import React from 'react';
import styles from './electricityBill.module.css';
import DashboardLayout from '../../../../components/DashBoardLayout/DashboardLayout';
import { RiInformationLine } from 'react-icons/ri';

const ElectricityBill = () => {
  return (
    <DashboardLayout>
      <h3 className={styles.header}>
        Electricity Bill payment will be up soon
        <RiInformationLine className={styles.comming_soon_icon} />
      </h3>
    </DashboardLayout>
  );
};

export default ElectricityBill;
