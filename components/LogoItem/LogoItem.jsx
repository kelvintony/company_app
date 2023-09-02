import React from 'react';
import Image from 'next/image';
import dp4Logo from '../../assets/dp4.jpg';
import dp4_removebg from '../../assets/dp4_removebg.png';
import styles from './LogoItem.module.css';

const LogoItem = () => {
  return (
    <div className={styles.logo_container}>
      <Image src={dp4_removebg} alt='dataLogo2' className={styles.mylogo} />
      <p>DexomPay</p>
    </div>
  );
};

export default LogoItem;
