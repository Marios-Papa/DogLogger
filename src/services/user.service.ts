import User from '../models/user.model';
import bcrypt from 'bcryptjs';
import logger from '../config/logger';

export const ensureAdminUser = async () => {
  const adminEmail = "admin@example.com";
  const adminPassword = "admin123"; 

  const existingAdmin = await User.findOne({ where: { email: adminEmail } });
  
  if (!existingAdmin) {
    const hash = await bcrypt.hash(adminPassword, 10);
    await User.create({ email: adminEmail, password: hash, isAdmin: true });
    logger.info("Admin user created:", adminEmail);
  } else {
    logger.info("Admin user already exists");
  }
};
