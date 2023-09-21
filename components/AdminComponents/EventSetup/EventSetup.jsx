import SiginLoader from '../../SigninLoader/SiginLoader';
import React, { useState } from 'react';
import styles from './EventSetup.module.css';
import eventDateConverter from '../../../utils/eventDateConverter';

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
    // console.log(eventDateConverter(formData.eventDate));
  };
  return (
    <div className={styles.event_container}>
      <h3>Event Setup</h3>
      <div className={styles.event_wrapper}>
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
                    setFormData({
                      ...formData,
                      eventOption1Odd: e.target.value,
                    })
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
                    setFormData({
                      ...formData,
                      eventOption2Odd: e.target.value,
                    })
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
                ? `${styles.btn_create_event} ${styles.btn_create_event_inactive}`
                : styles.btn_create_event
            }
            disabled={loading}
          >
            {loading ? <SiginLoader /> : 'Create Event'}
          </button>
        </div>
        <div className={styles.kickStart_container}>
          <h3>Event Summary</h3>
          <div className={styles.right_panel}>
            {/* @ DUMMY DATA  */}
            <>
              {/* 
            <div className={styles.match_event}>
              <p>Football</p>
              <p>BURNLEY VS MANCHESTER CITY</p>
              <p>
                20:00 GMT+1 <br />{' '}
                <span style={{ fontSize: '14px' }}>11th Jun, 2023</span>
              </p>

              <div className={styles.event_computations}>
                <div
                  className={`${styles.computation_container} ${styles.show_container}`}
                >
                  <div className={styles.computation_wrapper}>
                    <div className={styles.wrapper_innera}>
                      <p
                        style={{
                          fontWeight: '700',
                        }}
                        className={styles.event_right}
                      >
                        Event 1:
                      </p>
                      <p
                        style={{
                          fontWeight: '700',
                          borderBottom: '1px solid gray',
                        }}
                        className={styles.event_right}
                      >
                        over 7.5 conners
                      </p>
                    </div>
                    <div className={styles.wrapper_innerb}>
                      <p
                        style={{
                          fontWeight: '700',
                        }}
                        className={styles.event_left}
                      >
                        Event 2:
                      </p>
                      <p
                        style={{
                          fontWeight: '700',
                          borderBottom: '1px solid gray',
                        }}
                        className={styles.event_left}
                      >
                        under 7.5 conners
                      </p>
                    </div>
                  </div>
                  <div className={styles.computation_wrapper}>
                    <div className={styles.wrapper_innera}>
                      <p className={styles.event_right}>
                        Odd 1: <br />
                        2.10
                      </p>
                    </div>
                    <div className={styles.wrapper_innerb}>
                      <p className={styles.event_left}>
                        {' '}
                        Odd 2: <br />
                        1.92
                      </p>
                    </div>
                  </div>
                </div>
                <button className={styles.btn_kick_start}>
                  Kick Start Event
                </button>
              </div>
            </div>
            */}
            </>

            <div className={styles.match_event}>
              <p>
                {formData?.eventType.length > 0 ? formData?.eventType : '*****'}
              </p>
              <p>
                {formData?.eventSelection.length > 0
                  ? formData?.eventSelection
                  : '************'}
              </p>
              <p>
                {formData?.eventTime.length > 0 ? formData?.eventTime : '****'}{' '}
                GMT+1 <br />{' '}
                <span style={{ fontSize: '14px' }}>
                  {formData?.eventDate.length > 0
                    ? eventDateConverter(formData.eventDate)
                    : '*******'}
                </span>
              </p>

              <div className={styles.event_computations}>
                <div
                  className={`${styles.computation_container} ${styles.show_container}`}
                >
                  <div className={styles.computation_wrapper}>
                    <div className={styles.wrapper_innera}>
                      <p
                        style={{
                          fontWeight: '700',
                        }}
                        className={styles.event_right}
                      >
                        Event 1:
                      </p>
                      <p
                        style={{
                          fontWeight: '700',
                          borderBottom: '1px solid gray',
                        }}
                        className={styles.event_right}
                      >
                        {formData?.eventOption1.length > 0
                          ? formData?.eventOption1
                          : '*******'}
                      </p>
                    </div>
                    <div className={styles.wrapper_innerb}>
                      <p
                        style={{
                          fontWeight: '700',
                        }}
                        className={styles.event_left}
                      >
                        Event 2:
                      </p>
                      <p
                        style={{
                          fontWeight: '700',
                          borderBottom: '1px solid gray',
                        }}
                        className={styles.event_left}
                      >
                        {formData?.eventOption2.length > 0
                          ? formData?.eventOption2
                          : '*******'}
                      </p>
                    </div>
                  </div>
                  <div className={styles.computation_wrapper}>
                    <div className={styles.wrapper_innera}>
                      <p className={styles.event_right}>
                        Odd 1: <br />
                        {formData?.eventOption1Odd.length > 0
                          ? formData?.eventOption1Odd
                          : '****'}
                      </p>
                    </div>
                    <div className={styles.wrapper_innerb}>
                      <p className={styles.event_left}>
                        {' '}
                        Odd 2: <br />
                        {formData?.eventOption2Odd.length > 0
                          ? formData?.eventOption2Odd
                          : '****'}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={submitFormData}
                  className={
                    loading
                      ? `${styles.btn_kick_start} ${styles.btn_kick_start_inactive}`
                      : styles.btn_kick_start
                  }
                  disabled={loading}
                >
                  {loading ? <SiginLoader /> : 'Create Event'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventSetup;
