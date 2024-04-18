import multer from "multer";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({
  storage: storage,
});


/*
This code is written in JAVASCRIPT and is utilizing the Node.js library called Multer, which is a middleware for handling multipart/form-data, which is primarily used for uploading files. Let's break down the code:

1. **Importing Multer**: The code starts by importing the Multer library. Multer is not a part of the standard Node.js library, so it needs to be installed separately using npm or yarn.

```TODO:JAVASCRIPT CODE
import multer from "multer";
```

2. **Setting up storage**: Multer requires a storage engine to store files. In this code, the `multer.diskStorage()` function is used to create a storage engine that stores files on the disk.

```TODO:JAVASCRIPT CODE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
```

   - `destination`: This function determines the destination directory where uploaded files will be stored. In this case, it's set to `./public/temp`, meaning that uploaded files will be stored in the `temp` directory within the `public` directory of the project.
   - `filename`: This function is used to determine what the file should be named when it's saved. Here, it simply uses the original name of the file.

3. **Exporting Multer Middleware**: The configured Multer instance is exported so that it can be used in other parts of the application.

```TODO:JAVASCRIPT CODE
export const upload = multer({
  storage: storage,
});
```

   - `multer({ storage: storage })`: This creates a Multer middleware instance with the specified storage configuration.

So, when you use `upload` middleware in your routes, it will handle file uploads according to the configuration provided (e.g., storing files in the specified directory with their original names).
 */