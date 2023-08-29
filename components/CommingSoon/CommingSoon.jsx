import React from 'react';
import commingImage from '../../assets/comingsoon.png';
import Image from 'next/image';
import styles from './CommingSoon.module.css';

const CommingSoon = ({ pageHeader }) => {
  return (
    <div className={styles.comming_container}>
      <h3>{pageHeader}</h3>
      <Image src={commingImage} alt='commingSoon' />
    </div>
  );
};

export default CommingSoon;
