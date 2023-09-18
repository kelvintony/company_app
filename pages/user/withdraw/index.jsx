import React from 'react';
import styles from './withdraw.module.css';
import DashboardLayout from '../../../components/DashBoardLayout/DashboardLayout';
import { RiInformationLine } from 'react-icons/ri';
import { useState } from 'react';
import { FaMoneyBillAlt } from 'react-icons/fa';

const Withdraw = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '' });
  const [formDataError, setFormDataError] = useState(false);

  const submitFormData = () => {};
  return (
    <DashboardLayout>
      <h3 className={styles.header}>
        Make Withdrawals
        <FaMoneyBillAlt className={styles.comming_soon_icon} />
      </h3>
      <section className={styles.withdraw_container}>
        <div className={styles.login_wrapper}>
          <div className={styles.input_wrapper}>
            <label htmlFor='amount'>
              Amount: <br />
              <input
                type='number'
                name='amount'
                className={styles.form_control}
                value={formData?.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <br />
              {formDataError && formData.email.length <= 0 ? (
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
            {loading ? <SiginLoader /> : 'Withdraw'}
          </button>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default Withdraw;
