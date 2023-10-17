import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import styles from './AdminTab.module.css';
import axios from 'axios';
import { useSession } from 'next-auth/react';

import Image from 'next/image';
import EventSetup from '../EventSetup/EventSetup';
import LiveEvent from '../LiveEvent/LiveEvent';
import TradeTransactions from '../TradeTransactions/TradeTransactions';

export default function AdminTab() {
  const { status, data: session } = useSession();

  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [rows, setRows] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    await axios
      .get(`/api/admin/game/allgames`)
      .then((res) => {
        setRows(res?.data?.message);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
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
            <Tab className={styles.userTab} label='Event Setup' value='1' />
            <Tab className={styles.userTab} label='Live Event' value='2' />
            <Tab
              className={styles.userTab}
              label='Trade Transactions'
              value='3'
            />
            <Tab
              className={styles.userTab}
              label='Financial Analytics'
              value='4'
            />
            <Tab className={styles.userTab} label='Users' value='5' />
          </TabList>
        </Box>
        <TabPanel value='1'>
          <div className={styles.tab_container}>
            <EventSetup />
          </div>
        </TabPanel>
        <TabPanel value='2'>
          <div className={styles.tab_container}>
            <LiveEvent />
          </div>
        </TabPanel>
        <TabPanel value='3'>
          <div className={styles.tab_container}>
            <TradeTransactions rows={rows} loading={loading} />
          </div>
        </TabPanel>
        <TabPanel value='4'>
          <div className={styles.tab_container}>
            <h3>Financial Analytics</h3>
          </div>
        </TabPanel>
        <TabPanel value='5'>
          <div className={styles.tab_container}>
            <h3>Users</h3>
          </div>
        </TabPanel>
      </TabContext>
    </Box>
  );
}
