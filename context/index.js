'use client';

import { createContext, useContext, useReducer } from 'react';
import { authConstants } from './constants';

const Store = createContext();

const reducer = (state, action) => {
  //   console.log(action);
  if (action.type === authConstants.LOGIN_REQUEST) {
    return {
      ...state,
      user: {
        ...state?.user,
        authenticating: true,
      },
    };
  } else if (action.type === authConstants.LOGIN_SUCCESS) {
    return {
      ...state,
      user: {
        ...action?.payload?.user,
        authenticating: false,
        authenticated: true,
      },
    };
  } else if (action.type === authConstants.LOGIN_FAILURE) {
    return {
      ...state,
      user: {
        ...state?.user,
        error: action?.payload,
        authenticating: false,
        authenticated: false,
      },
    };
  } else if (action.type === authConstants.SHOW_PAYMENT_MODAL) {
    return {
      ...state,
      paymentModal: !state.paymentModal,
    };
  } else if (
    action.type === authConstants.FETCH_USER_TRANSACTION_DETAILS_REQUEST
  ) {
    return {
      ...state,
      userTransactionProfile: {
        ...state.userTransactionProfile,
        loading: true,
      },
    };
  } else if (action.type === authConstants.FETCH_USER_TRANSACTION_DETAILS) {
    return {
      ...state,
      userTransactionProfile: {
        ...action?.payload,
        loading: false,
      },
    };
  } else {
    return state;
  }
};

export const useStore = () => useContext(Store);

export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    user: {
      authenticated: false,
      authenticating: true,
      error: null,
    },
    paymentModal: false,
    userTransactionProfile: {
      loading: true,
    },
  });

  return <Store.Provider value={[state, dispatch]}>{children}</Store.Provider>;
};
