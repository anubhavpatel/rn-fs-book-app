import express from "express";
import cloudinary from "../lib/cloudnary.js";
import Book from "../models/Book.js";
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

//create a book

router.post("/", protectRoute, async (req, res) => {

    try {
        const { title, caption, rating, image } = req.body;

        if (!image || !title || !caption || !rating) {
            return res.status(400).json({ message: "Please provide all fields" });

        }
        // upload image to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(
            image, // e.g., base64 or https URL
            {
                folder: "book_image", // ✅ folder name
                use_filename: true,   // optional
                unique_filename: false, // optional
            }
        );


        const imageUrl = uploadResponse.secure_url;

        //save to db
        const newBook = new Book({
            title,
            caption,
            rating,
            image: imageUrl,
            user: req.user._id
        })
        await newBook.save()

        res.status(201).json(newBook)
    } catch (error) {
        console.log("Error creating book", error);
        res.status(500).json({ message: error.message });
    }
})


// pagination => infinite loading
router.get("/", protectRoute, async (req, res) => {
   
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 3;

        const skip = (page - 1) * limit;

        const books = await Book.find().sort({ createdAt: -1 }).skip(skip).limit(limit).populate("user", "username profileImage")

        const totalBooks = await Book.countDocuments();
        res.send({
            books,
            currentPage: page,
            totalBooks,
            totalPages: Math.ceil(totalBooks / limit),
        });

    } catch (error) {
        console.log("Error in get all book route", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// get reccomended books by the logged user
router.get("/user", protectRoute, async (req, res) => {
    try {

        const books = await Book.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(books);

    } catch (error) {
        console.log("Get user books error", error.message);
        res.status(500).json({ message: "server error" });
    }
});


router.delete("/:id", protectRoute, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: "Book not found" });

        // check if user is the creater f book

        if (book.user.toString() !== req.user._id.toString())
            return res.status(401).json({ message: "Unauthorized" });


        // deleting image from cloudinary as well
        if (book.image && book.image.includes("cloudinary")) {
            try {
              //  const publicId = book.image.split("/").pop().split(".")[0];
                 const url = new URL(book.image);
                const path = url.pathname.split("/");
                const publicId = `${path[path.length - 2]}/${path[path.length - 1].split(".")[0]}`;
                await cloudinary.uploader.destroy(publicId);
            } catch (deleteError) {
                console.log("Error deleting image from cloudinary", deleteError);
            }
        }

        await book.deleteOne();
        res.json({ message: "Book deleted successfully" });

    } catch (error) {
        console.log("Error deleting book");
        res.status(500).json({ message: error.message });
    }
});





export default router;