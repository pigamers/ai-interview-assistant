// Storage utilities to manage localStorage quota
export const clearOldData = () => {
  try {
    // Clear old interview data if storage is getting full
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('persist:') && key !== 'persist:candidates') {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.warn('Failed to clear old data:', error);
  }
};

export const checkStorageQuota = () => {
  try {
    const testKey = 'storage-test';
    const testData = 'x'.repeat(1024); // 1KB test
    localStorage.setItem(testKey, testData);
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    console.warn('Storage quota check failed:', error);
    clearOldData();
    return false;
  }
};

// Monitor storage usage
export const getStorageUsage = () => {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length;
    }
  }
  return Math.round(total / 1024); // Return KB
};