// import multer from "multer";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
// import cloudinary from "../config/cloudinary.js";

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: async (req, file) => {
//     // Determine resource_type based on file mimetype
//     let resourceType = 'raw'; // default for PDFs, docs, etc.
    
//     if (file.mimetype.startsWith('image/')) {
//       resourceType = 'image';
//     } else if (file.mimetype.startsWith('video/')) {
//       resourceType = 'video';
//     }
    
//     return {
//       folder: "unidesk_files",
//       resource_type: resourceType,
     
      
//     };
//   },
// });

// const upload = multer({ storage });

// export default upload;