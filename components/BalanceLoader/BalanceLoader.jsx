import React from 'react';
import styles from './BalanceLoader.module.css';

const BalanceLoader = () => {
  return <span className={styles.spinner}></span>;
};

const BalanceLoader2 = () => {
  return <span className={styles.spinner2}></span>;
};
export { BalanceLoader, BalanceLoader2 };
