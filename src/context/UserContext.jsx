import React, { createContext, useContext, useReducer } from 'react';

const UserContext = createContext();

const initialState = {
  users: [],
  loading: false,
  error: null,
  filters: {
    search: '',
    name: '',
    email: '',
    company: '',
  },
  pagination: {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
  },
  sortConfig: {
    key: null,
    direction: 'asc',
  },
};

function userReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_USERS':
      return { ...state, users: action.payload, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'ADD_USER':
      return { 
        ...state, 
        users: [action.payload, ...state.users],
        pagination: {
          ...state.pagination,
          totalItems: state.pagination.totalItems + 1
        }
      };
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user => 
          user.id === action.payload.id ? action.payload : user
        ),
      };
    case 'DELETE_USER':
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.payload),
        pagination: {
          ...state.pagination,
          totalItems: state.pagination.totalItems - 1
        }
      };
    case 'SET_FILTERS':
      return { 
        ...state, 
        filters: { ...state.filters, ...action.payload },
        pagination: { ...state.pagination, currentPage: 1 }
      };
    case 'SET_PAGINATION':
      return { 
        ...state, 
        pagination: { ...state.pagination, ...action.payload } 
      };
    case 'SET_SORT':
      return { ...state, sortConfig: action.payload };
    default:
      return state;
  }
}

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
