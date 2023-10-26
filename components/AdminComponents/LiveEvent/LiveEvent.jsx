import React from 'react';
import styles from './LiveEvent.module.css';
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import UserLoader from '../../UserLoader/UserLoader';
import splitText from '../../../utils/splitText';
import SiginLoader from '../../SigninLoader/SiginLoader';
import { AiFillCheckCircle, AiFillLock } from 'react-icons/ai';
import { AlertHandler } from '../../../utils/AlertHandler';

const eventOptions = [
  {
    id: '1',
    eventOption: 'event 1',
  },
  {
    id: '2',
    eventOption: 'event 2',
  },
];

const LiveEvent = () => {
  const [selectedEvent, setSelectedEvent] = useState('');
  const [eventOptionType, setEventOptionType] = useState(eventOptions);
  const [gameInfo, setGameInfo] = useState(null);
  const [loadGameData, setLoadGameData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingForCancel, setLoadingForCancel] = useState(false);
  const [unlockGameLoading, setUnlockGameLoading] = useState(false);

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

  const kickStartGame = async (id) => {
    setLoading(true);
    setErrorMessage(null);

    setOpen(true); //! make sure you set this guy open for the MUI alert

    let gameId = id;
    try {
      const res = await axios.post(`/api/admin/game/kickoff/${gameId}`, {
        gameCount: 'started',
      });

      if (res) {
        fetchDame();
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage(error?.response?.data?.message);
      console.log(error);
    }
  };

  const unlockGame = async (id) => {
    setUnlockGameLoading(true);

    let gameId = id;
    try {
      const res = await axios.get(`/api/admin/game/kickoff/${gameId}`);

      if (res) {
        fetchDame();
        setUnlockGameLoading(false);
      }
    } catch (error) {
      setUnlockGameLoading(false);
      console.log(error);
    }
  };

  const concludeEvent = async (id) => {
    setLoading(true);

    let gameId = id;
    try {
      const res = await axios.post(`/api/admin/game/concludegame/${gameId}`, {
        selectedEvent,
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

  const cancelEvent = async (id) => {
    setLoadingForCancel(true);

    let gameId = id;
    try {
      const res = await axios.put(`/api/admin/game/concludegame/${gameId}`, {
        gameCount: 'started',
      });

      if (res) {
        fetchDame();
        setLoadingForCancel(false);
      }
    } catch (error) {
      setLoadingForCancel(false);
      console.log(error);
    }
  };
  return (
    <div className={styles.liveEvent_container}>
      <AlertHandler
        errorMessage={errorMessage}
        open={open}
        setOpen={setOpen}
        responseMessage={null}
      />
      <h3>Live Event</h3>
      <div className={styles.liveEvent_wrapper}>
        <div className={styles.left_panel}>
          {loadGameData && (
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
            <div className={styles.match_event}>
              <p>{gameInfo?.eventType}</p>
              <p style={{ lineHeight: '2.3rem', margin: '20px 0px' }}>
                {splitText(gameInfo?.eventSelection)?.textBeforeVS} <br /> VS{' '}
                <br />
                {splitText(gameInfo?.eventSelection)?.textAfterVS}
              </p>
              <p>
                {gameInfo?.eventTime} GMT+1 <br />{' '}
                <span style={{ fontSize: '14px' }}>{gameInfo?.eventDate}</span>
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
                        {gameInfo?.eventOption1}
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
                        {gameInfo?.eventOption2}
                      </p>
                    </div>
                  </div>
                  <div className={styles.computation_wrapper}>
                    <div className={styles.wrapper_innera}>
                      <p className={styles.event_right}>
                        Odd 1: <br />
                        {gameInfo?.eventOption1Odd?.$numberDecimal}
                      </p>
                    </div>
                    <div className={styles.wrapper_innerb}>
                      <p className={styles.event_left}>
                        {' '}
                        Odd 2: <br />
                        {gameInfo?.eventOption2Odd?.$numberDecimal}
                      </p>
                    </div>
                  </div>
                </div>
                {gameInfo?.eventMode === 'pending' &&
                !gameInfo?.status?.locked ? (
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          'Are you sure you you want to kick start game?'
                        )
                      )
                        kickStartGame(gameInfo?._id);
                    }}
                    className={styles.btn_kick_start}
                    disabled={loading}
                  >
                    {loading ? <SiginLoader /> : 'Kick Start Event'}
                  </button>
                ) : (
                  <AiFillLock className={styles.lock_icon} />
                )}

                {gameInfo?.status?.locked && (
                  <button
                    disabled={unlockGameLoading}
                    onClick={() => {
                      if (
                        window.confirm(
                          'Are you sure you you want to unlock game?'
                        )
                      )
                        unlockGame(gameInfo?._id);
                    }}
                    className={styles.btn_unlock}
                  >
                    {unlockGameLoading ? 'unlocking...' : 'Unclock Event'}
                  </button>
                )}

                <div className={styles.eventMode_container}>
                  <p>
                    Event mode:{' '}
                    <span
                      className={
                        gameInfo?.eventMode === 'pending'
                          ? styles.eventMode_pending
                          : gameInfo?.eventMode === 'running'
                          ? styles.eventMode_running
                          : gameInfo?.eventMode === 'cancelled'
                          ? styles.eventMode_cancel
                          : styles.eventMode_completed
                      }
                    >
                      {gameInfo?.eventMode}
                    </span>
                  </p>
                </div>
                <div className={styles.concludeEvent_container}>
                  {gameInfo?.eventMode === 'running' && <p>Conclude Event</p>}

                  {gameInfo?.eventMode === 'running' && (
                    <div className={styles.input_wrapper}>
                      <label htmlFor='selectedEvent'>
                        Event: <br />
                        <select
                          name='selectedEvent'
                          id=''
                          value={selectedEvent}
                          onChange={(e) => setSelectedEvent(e.target.value)}
                        >
                          <option>select event</option>
                          {eventOptionType.map((events) => {
                            return (
                              <option
                                key={events.id}
                                value={events.eventOption}
                              >
                                {events.eventOption}
                              </option>
                            );
                          })}
                        </select>
                        <br />
                        {/* {formDataError && selectedEvent.length <= 0 ? (
                      <span style={{ color: 'red' }}>* required</span>
                    ) : (
                      ''
                    )} */}
                      </label>
                    </div>
                  )}
                  {gameInfo?.eventMode === 'completed' && (
                    <p
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                    >
                      Concluded:
                      <span style={{ color: '#3BA54B' }}>
                        {gameInfo?.concludedEvent === 'event 1'
                          ? 'Outcome 1'
                          : 'Outcome 2'}
                      </span>
                      <AiFillCheckCircle
                        style={{ color: '#3BA54B' }}
                        size={20}
                      />
                      {/* 3BA54B */}
                    </p>
                  )}

                  {gameInfo?.eventMode === 'running' && (
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            'Are you sure you want to conclude event?'
                          )
                        )
                          concludeEvent(gameInfo?._id);
                      }}
                      className={styles.btn_kick_start}
                      disabled={loading}
                    >
                      {loading ? <SiginLoader /> : 'Conclude Event'}
                    </button>
                  )}
                  <div></div>

                  {gameInfo?.eventMode === 'running' && (
                    <button
                      style={{}}
                      disabled={loadingForCancel}
                      onClick={() => {
                        if (
                          window.confirm(
                            'Are you sure you want to cancel event?'
                          )
                        )
                          cancelEvent(gameInfo?._id);
                      }}
                      className={styles.btn_cancel_game}
                    >
                      {loadingForCancel ? <SiginLoader /> : 'Cancel Event'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className={styles.right_panel}>
          <h3>Right panel</h3>
        </div>
      </div>
    </div>
  );
};

export default LiveEvent;
