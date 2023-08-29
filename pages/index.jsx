import React from 'react';
import styles from '../styles/Home.module.css';
import Image from 'next/image';
import DP1 from '../assets/DP1.png';
import Lottie from 'lottie-react';
import animationData from '../assets/hand-scrolls-the-messages-on-the-phone.json';
// import animationData from '../assets/mwEg4mdXIv.json';

import { GoArrowRight } from 'react-icons/go';
import { useRouter } from 'next/router';
import Typewriter from 'typewriter-effect';

const Home = () => {
  const router = useRouter();

  return (
    <div className={styles.container}>
      {/* Hero section  */}
      <div className={styles.hero_wrapper}>
        <div className={styles.hero_section}>
          <div className={styles.inner_a}>
            <h1>
              Maximize profits with AI, unlocking untapped potential in sports
              trading.
            </h1>
            {/* <p>Pay less and get more on data.</p> */}
            <div className={styles.type_writter}>
              {/* Pay Less And  */}
              <Typewriter
                options={{
                  autoStart: true,
                  loop: true,
                  delay: 50,
                  typeSpeed: 200,
                  strings: [
                    ' Delivering winning results and transforming losses into success',
                  ],
                }}
              />
            </div>
            {/* <p>
            Pay less and get more on data, Cheap and affordable don't miss out.
          </p> */}
            <button
              onClick={() => router.push('/auth/register')}
              className={styles.btn_hero}
            >
              Join Now For Free
            </button>
          </div>
          <div className={styles.inner_b}>
            <Image className={styles.hero_logo} alt='hero_image' src={DP1} />
          </div>
        </div>
      </div>

      {/* Section A  */}
      <div className={styles.ourWord_container}>
        <h3>Our Word Is Our Bond!</h3>
        <p>
          Discover a world of endless possibilities, where services are
          customized to exceed your expectation.
        </p>
        <div className={styles.list_of_offers}>
          <div className={styles.the_offers}>
            <h3>Instant Wallet Funding</h3>
            <h3>Purchase Data And Airtime</h3>
            <h3>Cable TV Subsciptions</h3>
            <h3>Electricity Bill Payments</h3>
          </div>
          <div className={styles.list_animation}>
            <Lottie animationData={animationData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
