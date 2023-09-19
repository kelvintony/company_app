import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './MainTransaction.module.css';
import { useRouter } from 'next/router';
import axios from 'axios';

import { getSession, useSession } from 'next-auth/react';
import formatDateTimeToGMT1 from '../../utils/dateTimeConverter';

import { DataGrid } from '@mui/x-data-grid';
import Link from 'next/link';
import UserLoader from '../UserLoader/UserLoader';

// const transaction = [
//   {
//     reference:'1',

//   }
// ]

const MainTransactionTable = () => {
  const [windowWidth, setWindowWidth] = useState(null);

  const columns = [
    {
      field: 'reference',
      headerName: 'Order ID',
      width: windowWidth <= 400 ? 200 : 300,
      renderCell: (params) => (
        <Link href={`/user/transactions?${params.value}`} passHref>
          <button
            style={{
              color: 'blue',
              textDecoration: 'underline',
            }}
          >
            {params.value}
          </button>
        </Link>
      ),
    },
    { field: 'whatFor', headerName: 'Description', width: 250 },
    { field: 'createdAt', headerName: 'Date', width: 300 },
    { field: 'amount', headerName: 'Amount', width: 200 },
  ];

  const [rows, setRows] = useState([]);
  const router = useRouter();

  const { status, data: session } = useSession();

  const { redirect } = router.query;
  const { pathname } = router;

  // const effectRan = useRef(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const updateWindowWidth = () => {
      setWindowWidth(window.innerWidth);
    };

    updateWindowWidth();

    window.addEventListener('resize', updateWindowWidth);

    // Cleanup the event listener when component unmounts
    return () => {
      window.removeEventListener('resize', updateWindowWidth);
    };
  }, []);

  // useEffect(() => {
  //   const getPosts = async () => {
  //     setLoading(true);
  //     await axios
  //       .get(`/api/transactions`)
  //       .then((res) => {
  //         setRows(res?.data?.message);
  //         setLoading(false);
  //       })
  //       .catch((err) => {
  //         setLoading(false);
  //         console.log(err);
  //       });
  //   };
  //   getPosts();
  // }, []);

  const formattedRows = rows.map((row) => ({
    ...row,
    createdAt: formatDateTimeToGMT1(row?.createdAt),
  }));

  return (
    <div className={styles.interest_container}>
      <h1>Transactions</h1>
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
            getRowId={(row) => row?.reference}
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

export default MainTransactionTable;
