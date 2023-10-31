import mongoose from 'mongoose';

async function connect() {
  mongoose.set('strictQuery', false);

  try {
    const db = await mongoose
      .connect(
        `${process.env.MONGODB_URI}`,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          // useFindAndModify: true,
        }
        // 6000000
      )
      .then(() => {
        console.log('connection successful');
      });
  } catch (error) {
    console.log('something went wrong with db', error.message);
  }
}

const db = { connect };

export default db;
