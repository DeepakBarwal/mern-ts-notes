import app from './app';
import env from './util/validateEnv';
import mongoose from "mongoose";

const PORT = env.PORT;

mongoose.connect(env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected')
    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    });
  })
  .catch(console.error);
