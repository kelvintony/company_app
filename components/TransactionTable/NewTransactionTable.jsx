import React from 'react';
import styles from './NewTransactionTable.module.css';
import DataTable from 'react-data-table-component';
import axios from 'axios';

const NewTransactionTable = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    await axios
      .get(`/api/customers/transactions`)
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
    <div className={styles.transaction_container}>
      <h3>Trades</h3>
      <DataTable />
    </div>
  );
};

export default NewTransactionTable;
