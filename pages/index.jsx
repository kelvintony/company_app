import React from 'react';
import styles from '../styles/Home.module.css';
import Image from 'next/image';
import DP1 from '../assets/DP1.png';
import YoutubeVideo from '../components/YoutubeVideo/YoutubeVideo';
import { GoArrowRight } from 'react-icons/go';
import { useRouter } from 'next/router';
import Typewriter from 'typewriter-effect';
import Marquee from 'react-fast-marquee';
import Lottie from 'lottie-react';
import animation_lm2czdts from '../assets/animation_file/animation_lm2czdts.json';
import animation_lm3whktr from '../assets/animation_file/animation_lm3whktr.json';
import animation_lm3wusmr from '../assets/animation_file/animation_lm3wusmr.json';
import animation_lm3x2njy from '../assets/animation_file/animation_lm3x2njy.json';

import {
  partner1,
  partner2,
  partner3,
  partner4,
  partner5,
  partner6,
  partner7,
  partner8,
  partner9,
  partner10,
  partner11,
  partner12,
  partner13,
  partner14,
  partner15,
} from '../assets';

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
              trading
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
                    'Delivering winning results and transforming losses into success.',
                    'Achieving victorious outcomes and turning defeats into triumphs.',
                    'Delivering triumphant results and converting setbacks into victories.',
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

      {/* Youtube section  */}
      <section className={styles.youtube_container}>
        <div className={styles.youtube_inner_a}>
          <YoutubeVideo />
        </div>
        <div className={styles.youtube_inner_b}>
          <h3>Stop Gambling, Start Trading</h3>
          <p>
            More losses than winnings, time-consuming research, bookmaker
            restrictions, financial abuse and lack of emotional discipline has
            hindered profits and money-making from sports by bettors
          </p>
          <p>
            DPay has created a revolutionized AI that identifies opportunities
            in sports betting which guarantee marginal profits through
            leveraging various odds from different bookmakers on same events.
          </p>
          <p>With DPay&apos;s AI, you are sure of:</p>
          <ul>
            <li>Guaranteed profits on sports traded</li>
            <li>
              Our AI takes away lack of emotional discipline through proper
              financial management
            </li>
            <li>
              Avoid bookmaker restrictions and frozen funds by leveraging our AI
              on DPay
            </li>
          </ul>
        </div>
      </section>

      {/* Partners section  */}
      <section className={styles.partners_container}>
        <h3>Some Partners We Have Worked With..</h3>
        <section className={styles.our_partners}>
          {/* pauseOnHover={true} */}
          <Marquee speed={100} gradient={false}>
            <div className={styles.our_partners_inner}>
              <Image
                className={styles.partner_image}
                src={partner1}
                alt='pix_1'
              />
            </div>
            <div className={styles.our_partners_inner}>
              <Image
                className={styles.partner_image}
                src={partner2}
                alt='pix_1'
              />
            </div>
            <div className={styles.our_partners_inner}>
              <Image
                className={styles.partner_image}
                src={partner3}
                alt='pix_1'
              />
            </div>
            <div className={styles.our_partners_inner}>
              <Image
                className={styles.partner_image}
                src={partner4}
                alt='pix_1'
              />
            </div>
            <div className={styles.our_partners_inner}>
              <Image
                className={styles.partner_image}
                src={partner5}
                alt='pix_1'
              />
            </div>
            <div className={styles.our_partners_inner}>
              <Image
                className={styles.partner_image}
                src={partner6}
                alt='pix_1'
              />
            </div>
            <div className={styles.our_partners_inner}>
              <Image
                className={styles.partner_image}
                src={partner7}
                alt='pix_1'
              />
            </div>
            <div className={styles.our_partners_inner}>
              <Image
                className={styles.partner_image}
                src={partner8}
                alt='pix_1'
              />
            </div>
            <div className={styles.our_partners_inner}>
              <Image
                className={styles.partner_image}
                src={partner9}
                alt='pix_1'
              />
            </div>
            <div className={styles.our_partners_inner}>
              <Image
                className={styles.partner_image}
                src={partner10}
                alt='pix_1'
              />
            </div>
            <div className={styles.our_partners_inner}>
              <Image
                className={styles.partner_image}
                src={partner11}
                alt='pix_1'
              />
            </div>
            <div className={styles.our_partners_inner}>
              <Image
                className={styles.partner_image}
                src={partner12}
                alt='pix_1'
              />
            </div>
            <div className={styles.our_partners_inner}>
              <Image
                className={styles.partner_image}
                src={partner13}
                alt='pix_1'
              />
            </div>
            <div className={styles.our_partners_inner}>
              <Image
                className={styles.partner_image}
                src={partner14}
                alt='pix_1'
              />
            </div>
            <div className={styles.our_partners_inner}>
              <Image
                className={styles.partner_image}
                src={partner15}
                alt='pix_1'
              />
            </div>
          </Marquee>
        </section>
      </section>

      {/* why join us section  */}
      <section className={styles.why_join_wrapper}>
        <div className={styles.why_join_container}>
          <h3>Why Join Us</h3>
          <div className={styles.why_join_inner}>
            <div className={styles.join_inner_a}>
              <Lottie animationData={animation_lm3x2njy} />
              <p>Earn A Minimum Of 10% ROI Weekly</p>
            </div>
            <div className={styles.join_inner_a}>
              <Lottie animationData={animation_lm3whktr} />
              <p> Work Smart, Starting With As Little As $10</p>
            </div>
            <div className={styles.join_inner_a}>
              <Lottie animationData={animation_lm3wusmr} />
              <p>Earn 10% Bonus On Deposits By Referrals</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
