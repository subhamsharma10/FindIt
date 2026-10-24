import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import app from './app';

const port = Number(process.env.PORT || 3000);
const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/findit';

async function start() {
  try {
    await mongoose.connect(uri);
    console.log('[FindIt] MongoDB connected');
    app.listen(port, () => console.log(`[FindIt] API running at http://localhost:${port}`));
  } catch (error) {
    console.error('[FindIt] Startup failed:', error);
    process.exit(1);
  }
}
void start();
