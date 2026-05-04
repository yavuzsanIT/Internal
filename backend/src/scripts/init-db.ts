import { setupTables } from "../db/setup";

setupTables()
  .then(() => {
    console.log("DB setup completed");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
