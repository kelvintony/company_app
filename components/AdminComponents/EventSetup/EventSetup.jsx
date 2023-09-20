import SiginLoader from '../../SigninLoader/SiginLoader';
import React, { useState } from 'react';
import styles from './EventSetup.module.css';

const EventSetup = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    eventType: '',
    eventSelection: '',
    eventOption1: '',
    eventOption1Odd: '',
    eventOption2: '',
    eventOption2Odd: '',
    eventDate: '',
    eventTime: '',
  });
  const [formDataError, setFormDataError] = useState(false);

  const submitFormData = () => {
    console.log(formData);
  };
  return (
    <div className={styles.event_container}>
      <h3>Event Setup</h3>
      <div className={styles.login_wrapper}>
        <div className={styles.input_wrapper}>
          <label htmlFor='eventType'>
            Event Type: <br />
            <input
              type='text'
              name='eventType'
              className={styles.form_control}
              value={formData?.eventType}
              placeholder='e.g football / table tennis / basketball'
              onChange={(e) =>
                setFormData({ ...formData, eventType: e.target.value })
              }
            />
            <br />
            {formDataError && formData.eventType.length <= 0 ? (
              <span style={{ color: 'red' }}>* required</span>
            ) : (
              ''
            )}
          </label>
        </div>
        <div className={styles.input_wrapper}>
          <label htmlFor='eventSelection'>
            Event Selection : <br />
            <input
              type='text'
              name='eventSelection'
              className={styles.form_control}
              value={formData?.eventSelection}
              placeholder='e.g BURNLEY VS MANCHESTER CITY'
              onChange={(e) =>
                setFormData({ ...formData, eventSelection: e.target.value })
              }
            />
            <br />
            {formDataError && formData.eventSelection.length <= 0 ? (
              <span style={{ color: 'red' }}>* required</span>
            ) : (
              ''
            )}
          </label>
        </div>

        <div className={styles.event_option}>
          <div className={styles.input_wrapper}>
            <label htmlFor='eventOption1'>
              Event Option 1 : <br />
              <input
                type='text'
                name='eventOption1'
                className={styles.form_control}
                value={formData?.eventOption1}
                placeholder='e.g over 2.5'
                onChange={(e) =>
                  setFormData({ ...formData, eventOption1: e.target.value })
                }
              />
              <br />
              {formDataError && formData.eventOption1.length <= 0 ? (
                <span style={{ color: 'red' }}>* required</span>
              ) : (
                ''
              )}
            </label>
          </div>
          <div className={styles.input_wrapper}>
            <label htmlFor='eventOption1Odd'>
              Odd 1 : <br />
              <input
                type='text'
                name='eventOption1Odd'
                className={styles.form_control}
                value={formData?.eventOption1Odd}
                placeholder='e.g 1.90'
                onChange={(e) =>
                  setFormData({ ...formData, eventOption1Odd: e.target.value })
                }
              />
              <br />
              {formDataError && formData.eventOption1Odd.length <= 0 ? (
                <span style={{ color: 'red' }}>* required</span>
              ) : (
                ''
              )}
            </label>
          </div>
          <div className={styles.input_wrapper}>
            <label htmlFor='eventOption2'>
              Event Option 2 : <br />
              <input
                type='text'
                name='eventOption2'
                className={styles.form_control}
                value={formData?.eventOption2}
                placeholder='e.g under 2.5'
                onChange={(e) =>
                  setFormData({ ...formData, eventOption2: e.target.value })
                }
              />
              <br />
              {formDataError && formData.eventOption2.length <= 0 ? (
                <span style={{ color: 'red' }}>* required</span>
              ) : (
                ''
              )}
            </label>
          </div>
          <div className={styles.input_wrapper}>
            <label htmlFor='eventOption2Odd'>
              Odd 2 : <br />
              <input
                type='text'
                name='eventOption2Odd'
                className={styles.form_control}
                value={formData?.eventOption2Odd}
                placeholder='e.g 2.01'
                onChange={(e) =>
                  setFormData({ ...formData, eventOption2Odd: e.target.value })
                }
              />
              <br />
              {formDataError && formData.eventOption2Odd.length <= 0 ? (
                <span style={{ color: 'red' }}>* required</span>
              ) : (
                ''
              )}
            </label>
          </div>
        </div>
        <div className={styles.input_wrapper}>
          <label htmlFor='eventDate'>
            Date : <br />
            <input
              type='date'
              name='eventDate'
              className={styles.form_control}
              value={formData?.eventDate}
              onChange={(e) =>
                setFormData({ ...formData, eventDate: e.target.value })
              }
            />
            <br />
            {formDataError && formData.eventDate.length <= 0 ? (
              <span style={{ color: 'red' }}>* required</span>
            ) : (
              ''
            )}
          </label>
        </div>
        <div className={styles.input_wrapper}>
          <label htmlFor='eventTime'>
            Time : <br />
            <input
              type='time'
              name='eventTime'
              className={styles.form_control}
              value={formData?.eventTime}
              onChange={(e) =>
                setFormData({ ...formData, eventTime: e.target.value })
              }
            />
            <br />
            {formDataError && formData.eventTime.length <= 0 ? (
              <span style={{ color: 'red' }}>* required</span>
            ) : (
              ''
            )}
          </label>
        </div>

        <button
          onClick={submitFormData}
          className={
            loading
              ? `${styles.btn_hero} ${styles.btn_hero_inactive}`
              : styles.btn_hero
          }
          disabled={loading}
        >
          {loading ? <SiginLoader /> : 'Create Event'}
        </button>

        {/* <p className={styles.withdraw_text}>
          withdrawals takes 5mins - 24hrs to be processed.
        </p> */}
      </div>
    </div>
  );
};

export default EventSetup;
