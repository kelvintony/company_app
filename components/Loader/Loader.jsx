import React from 'react';
import styles from './Loader.module.css';

const Loader = () => {
  // const simpleDiv = {
  //   height: '300px',
  //   width: '300px',
  //   paddingLeft: '90px',
  // };

  return (
    <div>
      <div className={styles.spinner}></div>
    </div>
  );
};

export default Loader;
