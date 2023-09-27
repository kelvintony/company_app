import React from 'react';
import styles from './LiveEvent.module.css';
import { useState } from 'react';

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

  return (
    <div className={styles.liveEvent_container}>
      <h3>Live Event</h3>
      <div className={styles.liveEvent_wrapper}>
        <div className={styles.left_panel}>
          <div className={styles.match_event}>
            <p>Football</p>
            <p style={{ lineHeight: '2.3rem', margin: '20px 0px' }}>
              BURNLEY <br /> VS <br />
              MANCHESTER CITY
            </p>
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

              <div className={styles.eventMode_container}>
                <p>
                  Event mode: <span>completed</span>
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
        </div>
        <div className={styles.right_panel}>
          <h3>Right panel</h3>
        </div>
      </div>
    </div>
  );
};

export default LiveEvent;
