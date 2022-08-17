import * as mongoose from "mongoose";

let connection;

const connectMongo = async (opts: { dbName?: string; poolSize?: number }) => {
  const dbName = opts.dbName;
  const poolSize = opts.poolSize;
  try {
    console.log("[MongoDb#connectMongo] Started", opts);
    const additionalOptions = {};

    additionalOptions["maxPoolSize"] = poolSize || 200;

    if (dbName) {
      additionalOptions["dbName"] = dbName;
    }

    if (!connection) {
      connection = mongoose.connect(process.env.MONGODB_URI, {
        ...additionalOptions,
      });
      await connection;
      // connection = await mongoose.connect(process.env.MONGODB_URI, {
      //   ...additionalOptions,
      // });
      // await connection;

      console.log("database connected");

      // log all queries
      await new Promise((resolve, reject) => {
        mongoose.set("debug", (collectionName, method, query, doc) => {
          console.log(
            `[Mongo DB query]${collectionName}.${method}`,
            JSON.stringify(query),
            doc
          );
          resolve(undefined);
        });
      });
    } else {
      console.log("db already connected");
    }

    return {
      connection,
    };
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

export const MongoDb = {
  connectMongo,
};
