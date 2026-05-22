import Clinic from '../models/Clinic.js';

export const ensureDefaultClinic = async () => {
  const count = await Clinic.countDocuments();
  if (count === 0) {
    await Clinic.create({
      name: 'Main Branch',
      address: '',
      phone: '',
      isActive: true,
    });
    console.log('Default clinic created: Main Branch');
  }
};
