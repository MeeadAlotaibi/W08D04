const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
require("./db"); //استدعاء للداتا بيس

////////////////////////////////////////////////////
const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

//////// For Role //////////
const roleRouter = require("./routers/routes/role");
app.use(roleRouter);

//////// For User ///////////
const userRouter = require("./routers/routes/user");
app.use(userRouter);


////////// For Tasks ////////
const taskRouter = require("./routers/routes/post");
app.use(taskRouter);


////////////////////////////////////////////////////////////////////
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON ${PORT}`);
});
