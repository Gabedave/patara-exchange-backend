export default () => {
  const envFilePath =
    process.env.NODE_ENV === "dev" ? "./.env.development" : "./.env.production";

  console.log({ envFilePath });

  require("dotenv").config({ path: envFilePath });
};
