// Shared in-memory storage for API keys
// In a real application, you would use a database
let apiKeys = [
  {
    id: '1',
    name: 'Development Key',
    key: 'dk_dev_1234567890abcdef',
    createdAt: '2024-01-15T10:30:00Z',
    lastUsed: '2024-01-20T14:22:00Z'
  },
  {
    id: '2',
    name: 'Production Key',
    key: 'dk_prod_abcdef1234567890',
    createdAt: '2024-01-10T09:15:00Z',
    lastUsed: null
  }
];

export const apiKeysStore = {
  // Get all API keys
  getAll() {
    return [...apiKeys];
  },

  // Get a specific API key by ID
  getById(id) {
    return apiKeys.find(key => key.id === id);
  },

  // Create a new API key
  create(name) {
    const newKey = {
      id: Date.now().toString(),
      name: name.trim(),
      key: 'dk_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      createdAt: new Date().toISOString(),
      lastUsed: null
    };

    apiKeys.push(newKey);
    return newKey;
  },

  // Update an API key
  update(id, updates) {
    const keyIndex = apiKeys.findIndex(key => key.id === id);
    
    if (keyIndex === -1) {
      return null;
    }

    apiKeys[keyIndex] = {
      ...apiKeys[keyIndex],
      ...updates
    };

    return apiKeys[keyIndex];
  },

  // Delete an API key
  delete(id) {
    const keyIndex = apiKeys.findIndex(key => key.id === id);
    
    if (keyIndex === -1) {
      return null;
    }

    const deletedKey = apiKeys.splice(keyIndex, 1)[0];
    return deletedKey;
  },

  // Update last used timestamp
  updateLastUsed(id) {
    const keyIndex = apiKeys.findIndex(key => key.id === id);
    
    if (keyIndex !== -1) {
      apiKeys[keyIndex].lastUsed = new Date().toISOString();
    }
  }
}; 