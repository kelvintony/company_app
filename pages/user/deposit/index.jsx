import React, { forwardRef, useState } from 'react';
import styles from './deposit.module.css';
import DashboardLayout from '../../../components/DashBoardLayout/DashboardLayout';
import { RiLuggageDepositLine } from 'react-icons/ri';
import { BiCopy } from 'react-icons/bi';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Deposit = () => {
  // ALERT SECTION
  const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
  });

  const [open, setOpen] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  // THE END OF ALERT SECTION

  const [responseMessage, setResponseMessage] = useState(null);
  const [copied, setCopied] = useState(false);

  const [walletAddress, setWalletAddress] = useState(
    '1TFBbqZHks9XKqDLCF3C0Lo2Hje6QCQNwS5'
  );

  const handleCopy = () => {
    setOpen(true); // make sure you set this guy open
    setResponseMessage('Wallet Address copied');
  };

  return (
    <DashboardLayout>
      <h3 className={styles.header}>
        Make Deposit
        <RiLuggageDepositLine className={styles.comming_soon_icon} />
      </h3>
      {responseMessage && (
        <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity='success'
            sx={{ width: '100%' }}
          >
            {responseMessage}
          </Alert>
        </Snackbar>
      )}
      <section className={styles.desposit_container}>
        <p>
          Your wallet is credited automatically when you make payment to this
          wallet address
        </p>
        <p>
          USDT (TRC-20) - <span>1TFBbqZHks9XKqDLCF3C0Lo2Hje6QCQNwS5</span>
        </p>
        <CopyToClipboard text={walletAddress} onCopy={handleCopy}>
          <button className={styles.btn_copy}>
            Copy <BiCopy />
          </button>
        </CopyToClipboard>
      </section>
    </DashboardLayout>
  );
};

export default Deposit;
