import { useEffect } from 'react';
import { useUserContext } from '../context/UserContext';
import { userService } from '../services/userService';

export const useUsers = () => {
  const { state, dispatch } = useUserContext();

  const fetchUsers = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const users = await userService.getUsers();
      dispatch({ type: 'SET_USERS', payload: users });
      dispatch({ 
        type: 'SET_PAGINATION', 
        payload: { totalItems: users.length } 
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const createUser = async (userData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const newUser = await userService.createUser(userData);
      dispatch({ type: 'ADD_USER', payload: newUser });
      return newUser;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateUser = async (id, userData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const updatedUser = await userService.updateUser(id, userData);
      dispatch({ type: 'UPDATE_USER', payload: updatedUser });
      return updatedUser;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const deleteUser = async (id) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await userService.deleteUser(id);
      dispatch({ type: 'DELETE_USER', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    ...state,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    dispatch,
  };
};
