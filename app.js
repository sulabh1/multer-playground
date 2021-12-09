const multer = require("multer");
const path = require("path");
const express = require("express");
const { User, sequelize } = require("./models");

const app = express();

app.use(express.json());
// const upload = multer({
//   dest: "images",
//   limits: {
//     fileSize: 1000000,
//   },
//   fileFilter(req, file, cb) {
//     if (!file.originalname.match(/\.(doc|docx)$/)) {
//       return cb(new Error("Please upload word document"));
//     }
//     cb(undefined, true);
//     //     cb(new Error("File must be a pdf"));
//     //     //no error for the undefined and true is for expecting file will be uploaded. accept the upload
//     //     cb(undefined, true);
//     //     //no error and and false to reject the upload and send the error
//     //     cb(undefined, false);
//   },
// });
// const uploadAvatar = multer({
//   // dest: "avatar",
//   limits: {
//     fileSize: 1000000,
//   },
//   fileFilter(req, file, cb) {
//     if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
//       return cb(new Error("Please upload image file"));
//     }
//     cb(undefined, true);
//   },
// });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "avatar");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: "1000000",
  },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));

    if (mimType && extname) {
      return cb(null, true);
    }
    cb("Give proper files format to upload");
  },
});

app.post(
  "/users",
  upload.single("avatar"),
  async (req, res) => {
    const { name, email, password } = req.body;
    const avatar = req.file.path;
    console.log(avatar);
    const user = await User.create({ name, email, password, avatar });
    res.status(201).json({
      status: "success",
      data: {
        user,
      },
    });
  },
  (err, req, res, next) => {
    console.log(err);
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
);

app.get(
  "/user",
  async (req, res) => {
    const user = await User.find();
    res.status(201).json({
      status: "success",
      data: {
        user,
      },
    });
  },
  (err, req, res, next) => {
    console.log(err);
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
);

// const errorMiddleware = (req, res, next) => {
//   throw new Error("from my middleware");
// };

// app.post(
//   "/upload",
//   upload.single("upload"),
//   (req, res) => {
//     res.send("images uploaded successfully");
//   },
//   (error, req, res, next) => {
//     res.status(400).json({
//       message: error.message,
//     });
//   }
// );
// app.post(
//   "/users/me/avatar",
//   uploadAvatar.single("avatar"),
//   (req, res) => {
//     res.send("profile pic upload successful");
//   },
//   (err, req, res, next) => {
//     res.status(400).json({
//       message: err.message,
//     });
//   }
// );
app.use("/avatar", express.static("./avatar"));
app.set("port", process.env.PORT || 3030);

app.listen(app.get("port"), () => {
  console.log(`Listening to the port ${app.get("port")}`);
  sequelize.authenticate().then(() => {
    console.log("db connected successful");
  });
});
