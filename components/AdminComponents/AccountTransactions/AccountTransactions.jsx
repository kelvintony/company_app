import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './AccountTransactions.module.css';
import { useRouter } from 'next/router';
import axios from 'axios';

import { useSession } from 'next-auth/react';
import formatDateTimeToGMT1 from '../../../utils/dateTimeConverter';

import { DataGrid } from '@mui/x-data-grid';
import Link from 'next/link';
import AccountTransactionsModal from './AccountTransactionsModal';
// import Loader from '../../Loader/Loader';

import UserLoader from '../../UserLoader/UserLoader';

const AccountTransactions = () => {
  const columns = [
    {
      field: '_id',
      headerName: 'ID',
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
    { field: 'walletAddress', headerName: 'Wallet Address', width: 200 },
    { field: 'fullName', headerName: 'Full Name', width: 200 },

    { field: 'whatFor', headerName: 'What For', width: 230 },

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
    walletAddress: row?.userId?.walletAddress,
  }));

  const fetchTransactions = async () => {
    setLoading(true);
    await axios
      .get(`/api/admin/wallet`)
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
      <h3 onClick={fetchTransactions}>Wallet Withdrawals / Top Ups</h3>

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
      <AccountTransactionsModal
        setShowPopup={setShowPopup}
        showPopup={showPopup}
        userId={userId}
      />
    </div>
  );
};

export default AccountTransactions;
