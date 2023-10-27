import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import styles from './UsersTab.module.css';
import { useSession } from 'next-auth/react';
import Transactions from '.././TransactionTable/MainTransactionTable';
import AccountHistory from '../AccountHistoryTable/AccountHistoryTable';

export default function UsersTab() {
  const { status, data: session } = useSession();

  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList
            onChange={handleChange}
            aria-label='lab API tabs example'
            variant='scrollable'
            scrollButtons
            allowScrollButtonsMobile
            // scrollButtons='auto'
            // aria-label="scrollable auto tabs example"
          >
            <Tab className={styles.userTab} label='Transactions' value='1' />
            <Tab
              className={styles.userTab}
              label='Wallet Withdrawals / Top Ups'
              value='2'
            />
          </TabList>
        </Box>
        <TabPanel value='1'>
          <div className={styles.tab_container}>
            <Transactions />
          </div>
        </TabPanel>
        <TabPanel value='2'>
          <div className={styles.tab_container}>
            <AccountHistory />
          </div>
        </TabPanel>
      </TabContext>
    </Box>
  );
}
