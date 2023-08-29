import React from 'react';
import Image from 'next/image';
import dp4Logo from '../../assets/dp4.jpg';
import dp4_removebg from '../../assets/dp4_removebg.png';
import styles from './LogoItem.module.css';

const LogoItem = () => {
  return (
    <div>
      <Image src={dp4_removebg} alt='dataLogo2' className={styles.mylogo} />
    </div>
  );
};

export default LogoItem;
