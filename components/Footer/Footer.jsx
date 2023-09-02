import React from 'react';
import styles from './Footer.module.css';
import Image from 'next/image';
import { AiTwotoneHeart } from 'react-icons/ai';
import { CiFacebook } from 'react-icons/ci';
import { AiOutlineInstagram } from 'react-icons/ai';
import { FiTwitter } from 'react-icons/fi';
import { AiOutlineLinkedin } from 'react-icons/ai';
import LogoItem from '../LogoItem/LogoItem';
import { useRouter } from 'next/router';

const Footer = () => {
  const router = useRouter();
  return (
    <>
      <div className={styles.footer_container}>
        <div className={styles.logo_container_footer}>
          <LogoItem />
        </div>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint earum
          illum quaerat cum, autem eligendi facere possimus nisi officia soluta?
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto
          adipisci ea ducimus? Ab perspiciatis eligendi voluptas eos ipsam porro
        </p>
        <div className={styles.social_icons}>
          <CiFacebook className={styles.social_items} />
          <AiOutlineInstagram className={styles.social_items} />
          <FiTwitter className={styles.social_items} />
          <AiOutlineLinkedin className={styles.social_items} />
        </div>
        <div className={styles.footer_menuIcons}>
          <button
            onClick={() => router.push('/')}
            className={styles.menu_items}
          >
            Home
          </button>
          <button
            onClick={() => router.push('/reach-us')}
            className={styles.menu_items}
          >
            Reach Us
          </button>
          <button
            onClick={() => router.push('/about-us')}
            className={styles.menu_items}
          >
            About us
          </button>
        </div>
      </div>
    </>
  );
};

export default Footer;
