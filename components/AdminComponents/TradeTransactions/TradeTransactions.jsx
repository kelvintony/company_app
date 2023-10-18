import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './TradeSanctions.module.css';
import { useRouter } from 'next/router';
import axios from 'axios';

import { useSession } from 'next-auth/react';
import formatDateTimeToGMT1 from '../../../utils/dateTimeConverter';

import { DataGrid } from '@mui/x-data-grid';
import Link from 'next/link';
import TradeModal from './TradeModal';
// import Loader from '../../Loader/Loader';

import UserLoader from '../../UserLoader/UserLoader';

const TradeTransactions = () => {
  const columns = [
    {
      field: '_id',
      headerName: 'Trade ID',
      width: 250,
      renderCell: (params) => (
        <button
          onClick={() => editUser(params.id)}
          style={{ color: 'blue', textDecoration: 'underline' }}
        >
          {params.value}
        </button>
      ),
    },
    {
      field: 'isUserTradeProcessed',
      headerName: 'is Trade Processed',
      width: 200,
      renderCell: (params) => (
        <p
          className={
            params.value === true ? styles.trade_is_true : styles.trade_is_false
          }
        >
          {/* {params.value} */}
          {params?.value === true ? 'yes' : 'no'}
        </p>
      ),
    },
    { field: 'fullName', headerName: 'Full Name', width: 200 },

    { field: 'eventSelection', headerName: 'Game / Event', width: 250 },
    { field: 'eventDate', headerName: 'Game Kick Off Time', width: 230 },
    {
      field: 'isGameTraded',
      headerName: 'Is Game Traded',
      width: 160,
      renderCell: (params) => (
        <p
          className={
            params.value === true ? styles.trade_is_true : styles.trade_is_false
          }
        >
          {/* {params.value} */}
          {params?.value === true ? 'true' : 'false'}
        </p>
      ),
    },
    { field: 'createdAt', headerName: 'Date Traded', width: 250 },
  ];

  const [rows, setRows] = useState([]);
  const router = useRouter();

  const { status, data: session } = useSession();

  const { redirect } = router.query;
  const { pathname } = router;

  // const effectRan = useRef(false);

  const [loading, setLoading] = useState(false);

  const [showPopup, setShowPopup] = useState(false);

  const [userId, setUserId] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const formattedRows = rows.map((row) => ({
    ...row,
    createdAt: formatDateTimeToGMT1(row?.createdAt),
    fullName: row?.userId?.fullName,
    eventSelection: row?.gameId?.eventSelection,
    eventDate: `${row?.gameId?.eventDate} - ${row?.gameId?.eventTime} `,
  }));

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

  const editUser = (id) => {
    setShowPopup(!showPopup);
    setUserId(id);
  };

  return (
    <div className={styles.transaction_container}>
      <h3 onClick={fetchTransactions}>Trades</h3>

      <div style={{ height: 400, width: '100%' }}>
        {loading ? (
          <UserLoader />
        ) : (
          <DataGrid
            rows={formattedRows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            getRowId={(row) => row?._id}
            components={{
              NoRowsOverlay: () => (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  No records available
                </div>
              ),
            }}
          />
        )}
      </div>
      <TradeModal
        setShowPopup={setShowPopup}
        showPopup={showPopup}
        userId={userId}
      />
    </div>
  );
};

export default TradeTransactions;
