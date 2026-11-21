const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const movieApi = {
  getAll: async () => {
    const res = await fetch(`${API_BASE}/movies`);
    if (!res.ok) {
      throw new Error('Failed to fetch movies from server.');
    }
    return res.json();
  },

  create: async (movieData) => {
    const res = await fetch(`${API_BASE}/movies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movieData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to create movie.');
    }
    return data;
  },

  update: async (id, updateData) => {
    const res = await fetch(`${API_BASE}/movies/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to update movie.');
    }
    return data;
  },

  delete: async (id) => {
    const res = await fetch(`${API_BASE}/movies/${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to delete movie.');
    }
    return data;
  },

  getRewatchOrder: async (id) => {
    const res = await fetch(`${API_BASE}/movies/${id}/rewatch-order`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to load rewatch order.');
    }
    return data;
  },
};

export const cinemaApi = {
  getAll: async () => {
    const res = await fetch(`${API_BASE}/cinemas`);
    if (!res.ok) {
      throw new Error('Failed to fetch cinemas from server.');
    }
    return res.json();
  },

  getBookingQuote: async (cinemaId, groupSize) => {
    const res = await fetch(`${API_BASE}/cinemas/${cinemaId}/booking?groupSize=${groupSize}`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to fetch booking quote.');
    }
    return data;
  },
};
