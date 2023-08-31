import React, { useState } from 'react';
import CommingSoon from '../components/CommingSoon/CommingSoon';
import styles from '../styles/ReachUs.module.css';

const ReachUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  const handleSubmit = () => {};
  return (
    <div>
      <div className={styles.contact_header}>
        <h1>
          We Would love <br /> To Hear From You.
        </h1>
        <p>Join us let&apos;s make the world a better place</p>
      </div>
      <section className={styles.contact_container}>
        <div className={styles.contact_inner}>
          <h3>You Can Reach Us...</h3>
          <div className={styles.contact_details}>
            <h4>HOME Office:</h4>
            <p>Chijioke Akwukuma street, Bera Estate Lekki Lagos</p>
          </div>
          <div className={styles.contact_details}>
            <h4>Email Address:</h4>
            <p>info@dpayai.vercel.app</p>
          </div>
          <div className={styles.contact_details}>
            <h4>Phone Numbers:</h4>
            <p>+910064484416</p>
          </div>
        </div>

        <div className={`${styles.contact_inner} ${styles.theForm}`}>
          <div className={styles.input_wrapper}>
            <label htmlFor='email'>
              name: <br />
              <input
                type='text'
                name='name'
                className={styles.form_control}
                // value={formData.email}
                // onChange={(e) =>
                //   setFormData({ ...formData, email: e.target.value })
                // }
              />
              <br />
              {/* {formDataError && formData.email.length <= 0 ? (
                <span style={{ color: 'red' }}>* required</span>
              ) : (
                ''
              )} */}
            </label>
          </div>
          <div className={styles.input_wrapper}>
            <label htmlFor='email'>
              Email: <br />
              <input
                type='email'
                name='email'
                className={styles.form_control}
                // value={formData.email}
                // onChange={(e) =>
                //   setFormData({ ...formData, email: e.target.value })
                // }
              />
              <br />
              {/* {formDataError && formData.email.length <= 0 ? (
                <span style={{ color: 'red' }}>* required</span>
              ) : (
                ''
              )} */}
            </label>
          </div>
          <div className={styles.input_wrapper}>
            <label htmlFor='email'>
              Title: <br />
              <input
                type='text'
                name='title'
                className={styles.form_control}
                // value={formData.email}
                // onChange={(e) =>
                //   setFormData({ ...formData, email: e.target.value })
                // }
              />
              <br />
              {/* {formDataError && formData.email.length <= 0 ? (
                <span style={{ color: 'red' }}>* required</span>
              ) : (
                ''
              )} */}
            </label>
          </div>
          <div className={styles.input_wrapper}>
            <label htmlFor='email'>
              Message: <br />
              <textarea
                type='text'
                name='message'
                cols='30'
                rows='4'
                className={styles.form_control}
                // value={formData.email}
                // onChange={(e) =>
                //   setFormData({ ...formData, email: e.target.value })
                // }
              />
              <br />
              {/* {formDataError && formData.email.length <= 0 ? (
                <span style={{ color: 'red' }}>* required</span>
              ) : (
                ''
              )} */}
            </label>
          </div>

          {responseMessage ? (
            <span className={styles.message_span}>{responseMessage}</span>
          ) : (
            <button onClick={handleSubmit} className={styles.btn_contact}>
              {loading ? 'Processing...' : 'Send'}
            </button>
          )}
        </div>
      </section>
    </div>
  );
};

export default ReachUs;
