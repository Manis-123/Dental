export const attachClinic = (req, res, next) => {
  const id = req.headers['x-clinic-id'];
  if (id && id !== 'all') req.clinicId = id;
  next();
};

export const clinicFilter = (req) => (req.clinicId ? { clinic: req.clinicId } : {});

export const withClinic = (req, body = {}) => (req.clinicId ? { ...body, clinic: req.clinicId } : body);
