const multer = require("multer");
const express = require("express");

const app = express();

const upload = multer({
  dest: "images",
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(doc|docx)$/)) {
      return cb(new Error("Please upload word document"));
    }
    cb(undefined, true);
    //     cb(new Error("File must be a pdf"));
    //     //no error for the undefined and true is for expecting file will be uploaded. accept the upload
    //     cb(undefined, true);
    //     //no error and and false to reject the upload and send the error
    //     cb(undefined, false);
  },
});
const uploadAvatar = multer({
  dest: "avatar",
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload image file"));
    }
    cb(undefined, true);
  },
});

// const errorMiddleware = (req, res, next) => {
//   throw new Error("from my middleware");
// };

app.post(
  "/upload",
  upload.single("upload"),
  (req, res) => {
    res.send("images uploaded successfully");
  },
  (error, req, res, next) => {
    res.status(400).json({
      message: error.message,
    });
  }
);
app.post(
  "/users/me/avatar",
  uploadAvatar.single("avatar"),
  (req, res) => {
    res.send("profile pic upload successful");
  },
  (err, req, res, next) => {
    res.status(400).json({
      message: err.message,
    });
  }
);

app.set("port", process.env.PORT || 3030);

app.listen(app.get("port"), () => {
  console.log(`Listening to the port ${app.get("port")}`);
});
