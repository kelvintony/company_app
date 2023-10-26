import SiginLoader from '../../SigninLoader/SiginLoader';
import React, { useEffect, useState } from 'react';
import styles from './EventSetup.module.css';
import eventDateConverter from '../../../utils/eventDateConverter';
import axios from 'axios';
import splitText from '../../../utils/splitText';
import { BiEdit } from 'react-icons/bi';
import { AiFillLock } from 'react-icons/ai';
import UserLoader from '../../UserLoader/UserLoader';
import { AlertHandler } from '../../../utils/AlertHandler';

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
    eventDateWithoutFormat: '',
  });
  const [formDataError, setFormDataError] = useState(false);

  const [gameInfo, setGameInfo] = useState(null);

  const [loadGameData, setLoadGameData] = useState(false);

  //! ALERT SECTION
  const [errorMessage, setErrorMessage] = useState(null);
  const [open, setOpen] = useState(false);
  //! THE END OF ALERT SECTION

  useEffect(() => {
    fetchDame();
  }, []);

  const fetchDame = async () => {
    setLoadGameData(true);
    const res = await axios.get('/api/admin/game');
    try {
      if (res) {
        setLoadGameData(false);
        setGameInfo(res.data.message);
      }
    } catch (error) {
      setLoadGameData(false);
      console.log(error);
    }
  };
  const submitFormData = async () => {
    setLoading(true);
    setOpen(true); //! make sure you set this guy open for the MUI alert

    try {
      const res = await axios.post('/api/admin/game', {
        ...formData,
        eventDate: eventDateConverter(formData.eventDate),
      });

      if (res) {
        fetchDame();
        setLoading(false);

        setFormData({
          eventType: '',
          eventSelection: '',
          eventOption1: '',
          eventOption1Odd: '',
          eventOption2: '',
          eventOption2Odd: '',
          eventDate: '',
          eventTime: '',
          eventDateWithoutFormat: '',
        });
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage(error?.response?.data?.message);

      console.log('');
    }
  };

  const editGameFunction = async () => {
    setLoading(true);

    let gameId = gameInfo._id;
    try {
      const res = await axios.post(`/api/admin/game/${gameId}`, {
        ...formData,
        eventDate: eventDateConverter(formData.eventDate),
      });

      if (res) {
        fetchDame();
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const editGame = () => {
    setFormData({
      ...formData,
      eventType: gameInfo?.eventType,
      eventSelection: gameInfo?.eventSelection,
      eventOption1: gameInfo?.eventOption1,
      eventOption1Odd: gameInfo?.eventOption1Odd,
      eventOption2: gameInfo?.eventOption2,
      eventOption2Odd: gameInfo?.eventOption2Odd,
      eventDate: gameInfo?.eventDateWithoutFormat,
      eventTime: gameInfo?.eventTime,
    });
  };
  return (
    <div className={styles.event_container}>
      <AlertHandler
        errorMessage={errorMessage}
        open={open}
        setOpen={setOpen}
        responseMessage={null}
      />
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
                  value={formData?.eventOption1Odd?.$numberDecimal}
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
                  value={formData?.eventOption2Odd?.$numberDecimal}
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
                  setFormData({
                    ...formData,
                    eventDate: e.target.value,
                    eventDateWithoutFormat: e.target.value,
                  })
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

          {gameInfo?.gameDescription === 'latest game' && (
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
          )}
          {gameInfo?.eventMode === 'pending' && (
            <button
              onClick={editGameFunction}
              className={
                loading
                  ? `${styles.btn_create_event} ${styles.btn_create_event_inactive}`
                  : styles.btn_create_event
              }
              disabled={loading}
            >
              {loading ? <SiginLoader /> : 'Edit Event'}
            </button>
          )}
        </div>
        <div className={styles.kickStart_container}>
          <h3>Event Summary</h3>

          {gameInfo?.eventMode === 'pending' ? (
            <BiEdit onClick={editGame} className={styles.edit_icon} />
          ) : (
            <AiFillLock className={styles.lock_icon} />
          )}
          {!gameInfo && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '20px',
              }}
            >
              <UserLoader />
            </div>
          )}
          {gameInfo && (
            <div className={styles.right_panel}>
              <div className={styles.match_event}>
                <p>
                  {gameInfo?.eventType.length > 0
                    ? gameInfo?.eventType
                    : '*****'}
                </p>
                <p style={{ lineHeight: '2.3rem', margin: '20px 0px' }}>
                  {gameInfo?.eventSelection.length > 0
                    ? splitText(gameInfo.eventSelection)?.textBeforeVS
                    : '********'}
                  <br /> {gameInfo?.eventSelection.length > 0 ? 'VS' : '***'}
                  <br />
                  {gameInfo?.eventSelection.length > 0
                    ? splitText(gameInfo.eventSelection)?.textAfterVS
                    : '********'}
                </p>
                <p>
                  {gameInfo?.eventTime.length > 0
                    ? gameInfo?.eventTime
                    : '****'}{' '}
                  GMT+1 <br />{' '}
                  <span style={{ fontSize: '14px' }}>
                    {gameInfo?.eventDate.length > 0
                      ? gameInfo?.eventDate
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
                          Outcome 1:
                        </p>
                        <p
                          style={{
                            fontWeight: '700',
                            borderBottom: '1px solid gray',
                          }}
                          className={styles.event_right}
                        >
                          {gameInfo?.eventOption1.length > 0
                            ? gameInfo?.eventOption1
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
                          Outcome 2:
                        </p>
                        <p
                          style={{
                            fontWeight: '700',
                            borderBottom: '1px solid gray',
                          }}
                          className={styles.event_left}
                        >
                          {gameInfo?.eventOption2.length > 0
                            ? gameInfo?.eventOption2
                            : '*******'}
                        </p>
                      </div>
                    </div>
                    <div className={styles.computation_wrapper}>
                      <div className={styles.wrapper_innera}>
                        <p className={styles.event_right}>
                          Odd 1: <br />
                          {gameInfo?.eventOption1Odd
                            ? gameInfo?.eventOption1Odd?.$numberDecimal
                            : '****'}
                        </p>
                      </div>
                      <div className={styles.wrapper_innerb}>
                        <p className={styles.event_left}>
                          {' '}
                          Odd 2: <br />
                          {gameInfo?.eventOption2Odd
                            ? gameInfo?.eventOption2Odd?.$numberDecimal
                            : '****'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventSetup;
