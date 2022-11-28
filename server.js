//SEQUELIZE

const app = require("./app");
const port = 8080; //process.env.PORT;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log("unhandledRejection", err);
  console.log("Shutting down");
  server.close(() => {
    process.exit(1);
  });
});