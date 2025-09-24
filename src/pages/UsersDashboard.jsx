import React, { useState, useMemo } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import { useUsers } from '../hooks/useUsers';
import { sortData, filterData, paginateData } from '../utils/helpers';
import UserTable from '../components/users/UserTable';
import UserForm from '../components/users/UserForm';
import FilterPanel from '../components/users/FilterPanel';
import Pagination from '../components/users/Pagination';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';

const UsersDashboard = () => {
  const { 
    users, 
    loading, 
    error, 
    filters, 
    pagination, 
    sortConfig,
    createUser, 
    updateUser, 
    deleteUser, 
    dispatch 
  } = useUsers();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Process users: filter, sort, and paginate
  const processedUsers = useMemo(() => {
    let filtered = filterData(users, filters);
    let sorted = sortData(filtered, sortConfig);
    let paginated = paginateData(sorted, pagination.currentPage, pagination.itemsPerPage);
    
    return {
      data: paginated,
      totalFiltered: filtered.length
    };
  }, [users, filters, sortConfig, pagination.currentPage, pagination.itemsPerPage]);

  // Event handlers
  const handleAddUser = async (userData) => {
    try {
      await createUser(userData);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  const handleEditUser = async (userData) => {
    try {
      await updateUser(selectedUser.id, { ...userData, id: selectedUser.id });
      setIsEditModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      await deleteUser(userToDelete);
      setIsDeleteConfirmOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const openDeleteConfirm = (userId) => {
    setUserToDelete(userId);
    setIsDeleteConfirmOpen(true);
  };

  const handleFilterChange = (newFilters) => {
    dispatch({ type: 'SET_FILTERS', payload: newFilters });
  };

  const handleClearFilters = () => {
    dispatch({ 
      type: 'SET_FILTERS', 
      payload: { search: '', name: '', email: '', company: '' } 
    });
  };

  const handleSort = (sortConfig) => {
    dispatch({ type: 'SET_SORT', payload: sortConfig });
  };

  const handlePageChange = (page) => {
    dispatch({ type: 'SET_PAGINATION', payload: { currentPage: page } });
  };

  const handleItemsPerPageChange = (itemsPerPage) => {
    dispatch({ 
      type: 'SET_PAGINATION', 
      payload: { 
        itemsPerPage, 
        currentPage: 1,
        totalItems: processedUsers.totalFiltered 
      } 
    });
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-2">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Users</h2>
          <p className="text-gray-600 mt-2">
            Manage your user database with full CRUD operations
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary flex items-center space-x-2 mt-4 sm:mt-0"
        >
          <Plus className="w-5 h-5" />
          <span>Add User</span>
        </button>
      </div>

      {/* Filter Panel */}
      <FilterPanel
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Loading State */}
      {loading && users.length === 0 ? (
        <LoadingSpinner size="lg" />
      ) : (
        <>
          {/* User Table */}
          <UserTable
            users={processedUsers.data}
            onEdit={openEditModal}
            onDelete={openDeleteConfirm}
            onSort={handleSort}
            sortConfig={sortConfig}
            isLoading={loading}
          />

          {/* Pagination */}
          {processedUsers.data.length > 0 && (
            <div className="mt-6">
              <Pagination
                currentPage={pagination.currentPage}
                totalItems={processedUsers.totalFiltered}
                itemsPerPage={pagination.itemsPerPage}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            </div>
          )}
        </>
      )}

      {/* Add User Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New User"
      >
        <UserForm
          onSubmit={handleAddUser}
          onCancel={() => setIsAddModalOpen(false)}
          isLoading={loading}
        />
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        title="Edit User"
      >
        <UserForm
          user={selectedUser}
          onSubmit={handleEditUser}
          onCancel={() => {
            setIsEditModalOpen(false);
            setSelectedUser(null);
          }}
          isLoading={loading}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteConfirmOpen}
        onClose={() => {
          setIsDeleteConfirmOpen(false);
          setUserToDelete(null);
        }}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this user? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setIsDeleteConfirmOpen(false);
                setUserToDelete(null);
              }}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteUser}
              className="btn-danger"
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete User'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UsersDashboard;
