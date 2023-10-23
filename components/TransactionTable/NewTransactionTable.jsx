import styles from './NewTransactionTable.module.css';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { useState, useEffect } from 'react';
import formatDateTimeToGMT1 from '../../utils/dateTimeConverter';
import UserLoader from '../UserLoader/UserLoader';

const NewTransactionTable = () => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTrades();
  }, []);

  const fetchTrades = async () => {
    setLoading(true);
    await axios
      .get(`/api/customers/transactions`)
      .then((res) => {
        setTrades(res?.data?.message);
        setLoading(false);
        console.log('traded game data', res?.data?.message);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const columns = [
    {
      name: 'ID',
      selector: (row) => row?._id,
      //   renderCell: (params) => (
      //     <button
      //       onClick={() => editUser(params.id)}
      //       style={{ color: 'blue', textDecoration: 'underline' }}
      //     >
      //       View details
      //     </button>
      //   ),
    },

    {
      name: 'Game / Event',
      selector: (row) => row?.gameId?.eventSelection,
    },
    {
      name: 'Game Kick Off Time',
      selector: (row) => row?.gameId?.eventSelection,
    },
    // { field: 'eventDate', headerName: 'Game Kick Off Time', width: 230 },
    // {
    //   field: 'isUserTradeProcessed',
    //   headerName: 'Trade Status',
    //   width: 200,
    //   renderCell: (params) => (
    //     <p
    //       className={
    //         params.value === true ? styles.trade_is_true : styles.trade_is_false
    //       }
    //     >
    //       {/* {params.value} */}
    //       {params?.value === true ? 'settled' : 'not settled'}
    //     </p>
    //   ),
    // },
    // { field: 'createdAt', headerName: 'Date Traded', width: 250 },
  ];

  return (
    <div className={styles.transaction_container}>
      <h3 onClick={fetchTrades}>Trades</h3>
      {loading ? <UserLoader /> : <DataTable columns={columns} data={trades} />}
    </div>
  );
};

export default NewTransactionTable;
