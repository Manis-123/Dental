import { createContext, useContext, useEffect, useState } from 'react';
import { api, setClinicId } from '../api';

const ClinicContext = createContext(null);

export function ClinicProvider({ children }) {
  const [clinics, setClinics] = useState([]);
  const [clinicId, setClinicIdState] = useState(() => localStorage.getItem('clinicId') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      setLoading(false);
      return;
    }
    api
      .getClinics()
      .then((list) => {
        setClinics(list);
        if (!clinicId && list.length > 0) {
          const id = list[0]._id;
          setClinicIdState(id);
          setClinicId(id);
          localStorage.setItem('clinicId', id);
        } else if (clinicId) {
          setClinicId(clinicId);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const selectClinic = (id) => {
    setClinicIdState(id);
    setClinicId(id || null);
    if (id) localStorage.setItem('clinicId', id);
    else localStorage.removeItem('clinicId');
    window.dispatchEvent(new Event('clinic-changed'));
  };

  const currentClinic = clinics.find((c) => c._id === clinicId);

  return (
    <ClinicContext.Provider value={{ clinics, clinicId, selectClinic, currentClinic, loading, refreshClinics: () => api.getClinics().then(setClinics) }}>
      {children}
    </ClinicContext.Provider>
  );
}

export const useClinic = () => useContext(ClinicContext);
