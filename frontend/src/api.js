// Get API URL from environment variable or use relative path
const API = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
let authToken = null;
let clinicId = null;

console.log(`[API] Base URL: ${API}`);

export const setAuthToken = (token) => {
  authToken = token;
};

export const setClinicId = (id) => {
  clinicId = id || null;
};

async function request(path, options = {}) {
  const url = `${API}${path}`;
  
  const headers = { 
    'Content-Type': 'application/json', 
    ...options.headers 
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }
  if (clinicId) {
    headers['X-Clinic-Id'] = clinicId;
  }

  try {
    // Add timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    const response = await fetch(url, { 
      ...options, 
      headers,
      signal: controller.signal,
      credentials: 'include' // Send cookies
    });

    clearTimeout(timeoutId);

    // Handle 401 Unauthorized - redirect to login
    if (response.status === 401) {
      authToken = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new Error('Unauthorized - Please login again');
    }

    // Parse response
    const contentType = response.headers.get('content-type');
    let data = {};
    
    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = { message: await response.text() };
    }

    if (!response.ok) {
      const error = new Error(data.message || `HTTP ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    // Handle network errors gracefully
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - Server took too long to respond');
    }
    
    if (error instanceof TypeError) {
      throw new Error(`Network error: ${error.message}`);
    }

    throw error;
  }
}

export const api = {
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => request('/auth/me'),

  getClinics: () => request('/clinics'),
  createClinic: (body) => request('/admin/clinics', { method: 'POST', body: JSON.stringify(body) }),
  updateClinic: (id, body) => request(`/admin/clinics/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteClinic: (id) => request(`/admin/clinics/${id}`, { method: 'DELETE' }),

  getStats: () => request('/stats'),
  getPatients: () => request('/patients'),
  getPatient: (id) => request(`/patients/${id}`),
  getPatientHistory: (id) => request(`/patients/${id}/history`),
  createPatient: (body) => request('/patients', { method: 'POST', body: JSON.stringify(body) }),
  updatePatient: (id, body) => request(`/patients/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deletePatient: (id) => request(`/patients/${id}`, { method: 'DELETE' }),

  getPatientImages: (patientId) => request(`/patients/${patientId}/images`),
  addPatientImage: (patientId, body) =>
    request(`/patients/${patientId}/images`, { method: 'POST', body: JSON.stringify(body) }),
  deletePatientImage: (patientId, imageId) =>
    request(`/patients/${patientId}/images/${imageId}`, { method: 'DELETE' }),

  getDoctors: () => request('/doctors'),
  createDoctor: (body) => request('/doctors', { method: 'POST', body: JSON.stringify(body) }),
  deleteDoctor: (id) => request(`/doctors/${id}`, { method: 'DELETE' }),
  getTreatments: () => request('/treatments'),
  createTreatment: (body) => request('/treatments', { method: 'POST', body: JSON.stringify(body) }),
  deleteTreatment: (id) => request(`/treatments/${id}`, { method: 'DELETE' }),
  getAppointments: () => request('/appointments'),
  createAppointment: (body) => request('/appointments', { method: 'POST', body: JSON.stringify(body) }),
  updateAppointment: (id, body) => request(`/appointments/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteAppointment: (id) => request(`/appointments/${id}`, { method: 'DELETE' }),

  getBills: () => request('/bills'),
  getBill: (id) => request(`/bills/${id}`),
  createBill: (body) => request('/bills', { method: 'POST', body: JSON.stringify(body) }),
  updateBill: (id, body) => request(`/bills/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteBill: (id) => request(`/bills/${id}`, { method: 'DELETE' }),

  getInventory: () => request('/inventory'),
  createInventory: (body) => request('/inventory', { method: 'POST', body: JSON.stringify(body) }),
  updateInventory: (id, body) => request(`/inventory/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteInventory: (id) => request(`/inventory/${id}`, { method: 'DELETE' }),

  getExpenses: () => request('/expenses'),
  createExpense: (body) => request('/expenses', { method: 'POST', body: JSON.stringify(body) }),
  deleteExpense: (id) => request(`/expenses/${id}`, { method: 'DELETE' }),

  getMonthlyReport: (year, month) => request(`/reports/monthly?year=${year}&month=${month}`),

  getTomorrowReminders: () => request('/reminders/tomorrow'),
  sendReminder: (appointmentId, channel = 'whatsapp') =>
    request(`/reminders/appointment/${appointmentId}`, {
      method: 'POST',
      body: JSON.stringify({ channel }),
    }),
  sendTomorrowReminders: (channel = 'whatsapp') =>
    request('/reminders/tomorrow', { method: 'POST', body: JSON.stringify({ channel }) }),
  getReminderLogs: () => request('/reminders/logs'),

  getAdminOverview: () => request('/admin/overview'),
  getUsers: () => request('/users'),
  createUser: (body) => request('/users', { method: 'POST', body: JSON.stringify(body) }),
  updateUser: (id, body) => request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteUser: (id) => request(`/users/${id}`, { method: 'DELETE' }),
};

const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
if (saved) setAuthToken(saved);
const savedClinic = typeof localStorage !== 'undefined' ? localStorage.getItem('clinicId') : null;
if (savedClinic) setClinicId(savedClinic);
