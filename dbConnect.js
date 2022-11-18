import mongoose from "mongoose";

const dbConnect = () => {
  const connectionParams = {
    useNewUrlParser: true,
    /* useCreateIndex: true,
    useUnifiedTopology: true, */
  };
  mongoose.connect(process.env.DB, connectionParams);

  mongoose.connection.on("connected", () => {
    console.log("Connected to database sucessfully");
  });

  mongoose.connection.on("error", (err) => {
    console.log("Error while connecting to database :" + err);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("Mongodb connection disconnected");
  });
};

export default dbConnect;
