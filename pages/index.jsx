import React from 'react';
import styles from '../styles/Home.module.css';
import Image from 'next/image';
import DP1 from '../assets/DP1.png';
import Lottie from 'lottie-react';
import animationData from '../assets/hand-scrolls-the-messages-on-the-phone.json';
import YoutubeVideo from '../components/YoutubeVideo/YoutubeVideo';
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
    </div>
  );
};

export default Home;
