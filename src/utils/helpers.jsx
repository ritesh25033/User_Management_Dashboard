export const sortData = (data, sortConfig) => {
  if (!sortConfig.key) return data;

  return [...data].sort((a, b) => {
    const aValue = getNestedValue(a, sortConfig.key);
    const bValue = getNestedValue(b, sortConfig.key);

    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
};

export const filterData = (data, filters) => {
  return data.filter(item => {
    const matchesSearch = !filters.search || 
      Object.values(item).some(value => 
        String(value).toLowerCase().includes(filters.search.toLowerCase())
      );

    const matchesName = !filters.name || 
      item.name.toLowerCase().includes(filters.name.toLowerCase());

    const matchesEmail = !filters.email || 
      item.email.toLowerCase().includes(filters.email.toLowerCase());

    const matchesCompany = !filters.company || 
      item.company?.name?.toLowerCase().includes(filters.company.toLowerCase());

    return matchesSearch && matchesName && matchesEmail && matchesCompany;
  });
};

export const paginateData = (data, currentPage, itemsPerPage) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return data.slice(startIndex, endIndex);
};

const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => current?.[key], obj) || '';
};

export const validateUserForm = (userData) => {
  const errors = {};

  if (!userData.name?.trim()) {
    errors.name = 'Name is required';
  }

  if (!userData.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
    errors.email = 'Email is invalid';
  }

  if (!userData.phone?.trim()) {
    errors.phone = 'Phone is required';
  }

  if (!userData.website?.trim()) {
    errors.website = 'Website is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
