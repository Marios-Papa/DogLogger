import app from './app';
import { connectToDatabase } from './config/db';
import { ensureAdminUser } from './services/user.service';
import logger from './config/logger';

const PORT = process.env.PORT || 3000;

(async () => {
  try{
    await connectToDatabase();
    await ensureAdminUser();
    app.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error('Unable to start the server:', error);
  }
})();