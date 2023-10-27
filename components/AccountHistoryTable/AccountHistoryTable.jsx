import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './AccountHistoryTable.module.css';
import { useRouter } from 'next/router';
import axios from 'axios';

import { useSession } from 'next-auth/react';
import formatDateTimeToGMT1 from '../../utils/dateTimeConverter';

import { DataGrid } from '@mui/x-data-grid';

import UserLoader from '../UserLoader/UserLoader';

const AccountHistoryTable = () => {
  const columns = [
    {
      field: '_id',
      headerName: 'ID',
      width: 250,
    },

    {
      field: 'amount',
      headerName: 'Amount',
      width: 140,
      renderCell: (params) => <p>&#36;{params.value}</p>,
    },

    {
      field: 'paymentStatus',
      headerName: 'Status',
      width: 200,
      renderCell: (params) => (
        <p
          className={
            params.value === 'completed'
              ? styles.trade_is_true
              : styles.trade_is_false
          }
        >
          {/* {params.value} */}
          {params?.value === 'completed' ? 'completed' : 'pending'}
        </p>
      ),
    },
    { field: 'whatFor', headerName: 'What For', width: 230 },

    { field: 'createdAt', headerName: 'Date', width: 250 },
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
  }));

  const fetchTransactions = async () => {
    setLoading(true);
    await axios
      .get(`/api/customers/transactions/account`)
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
      <h3 style={{ marginBottom: '20px' }} onClick={fetchTransactions}>
        Withdrawals / Top Ups
      </h3>

      <div style={{ height: 400, width: '100%' }}>
        {loading ? (
          <UserLoader />
        ) : (
          <DataGrid
            rows={formattedRows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            // checkboxSelection
            autoHeight
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
    </div>
  );
};

export default AccountHistoryTable;
