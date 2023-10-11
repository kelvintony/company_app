import React from 'react';
import styles from './LiveEvent.module.css';
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import UserLoader from '../../UserLoader/UserLoader';
import splitText from '../../../utils/splitText';
import SiginLoader from '../../SigninLoader/SiginLoader';

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
      console.log(error);
    }
  };
  return (
    <div className={styles.liveEvent_container}>
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
                        Event 1:
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
                        Event 2:
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
                        {gameInfo?.eventOption1Odd}
                      </p>
                    </div>
                    <div className={styles.wrapper_innerb}>
                      <p className={styles.event_left}>
                        {' '}
                        Odd 2: <br />
                        {gameInfo?.eventOption2Odd}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => kickStartGame(gameInfo?._id)}
                  className={styles.btn_kick_start}
                  disabled={loading}
                >
                  {loading ? <SiginLoader /> : 'Kick Start Event'}
                </button>

                <div className={styles.eventMode_container}>
                  <p>
                    Event mode:{' '}
                    <span
                      className={
                        gameInfo?.eventMode === 'pending'
                          ? styles.eventMode_pending
                          : gameInfo?.eventMode === 'running'
                          ? styles.eventMode_running
                          : styles.eventMode_completed
                      }
                    >
                      {gameInfo?.eventMode}
                    </span>
                  </p>
                </div>

                <div className={styles.concludeEvent_container}>
                  <p>Conclude Event</p>
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
                            <option key={events.id} value={events.eventOption}>
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
                  <button className={styles.btn_kick_start}>
                    Conclude Event
                  </button>
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
