import React, { useEffect, useState } from 'react';
import styles from './AccountHistoryTable.module.css';
import { useRouter } from 'next/router';
import axios from 'axios';

import { useSession } from 'next-auth/react';
import formatDateTimeToGMT1 from '../../utils/dateTimeConverter';

import { DataGrid } from '@mui/x-data-grid';

import UserLoader from '../UserLoader/UserLoader';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { BiCopy } from 'react-icons/bi';
import DepositModal from './AccountHistoryModal';

const AccountHistoryTable = () => {
  const truncateString = (inputString, maxLength) => {
    if (inputString?.length > maxLength) {
      return inputString?.slice(0, maxLength) + '...';
    } else {
      return inputString;
    }
  };

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
          View details
        </button>
      ),
    },

    {
      field: 'amount',
      headerName: 'Amount',
      width: 140,
      renderCell: (params) => <p>&#36;{params.value}</p>,
    },
    { field: 'whatFor', headerName: 'Description', width: 230 },

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

    { field: 'createdAt', headerName: 'Date', width: 250 },
  ];

  const [rows, setRows] = useState([]);
  const router = useRouter();

  const { status, data: session } = useSession();

  const { redirect } = router.query;
  const { pathname } = router;

  // const effectRan = useRef(false);

  const [loading, setLoading] = useState(false);

  const [isCopied, setIsCopied] = useState(false);

  const [buttonLoader, setButtonLoader] = useState(false);

  const [showPopup, setShowPopup] = useState(false);

  const [amount, setAmount] = useState('');

  const [transferDetails, setTransferDetails] = useState({});

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

  const editUser = async (transactionId) => {
    await axios
      .post(`/api/customers/transactions/account`, { transactionId })
      .then((res) => {
        setShowPopup(!showPopup);
        setTransferDetails(res?.data?.message);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={styles.transaction_container}>
      <h3 style={{ marginBottom: '20px' }}>Withdrawals / Top Ups</h3>

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
      <DepositModal
        setShowPopup={setShowPopup}
        showPopup={showPopup}
        amount={transferDetails?.amount}
        buttonLoader={buttonLoader}
        setButtonLoader={setButtonLoader}
        transferDetails={transferDetails}
      />
    </div>
  );
};

export default AccountHistoryTable;
