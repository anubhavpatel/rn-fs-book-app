import mongoose from "mongoose";


const bookSchema = new mongoose.Schema(
    {
        title: {
                type: String,
                require: true
        },
        caption: {
                type: String,
                require: true
        },
        image: {
                type: String,
                require: true
        },
        rating: {
                type: String,
                require: true,
                min: 1,
                max: 3
        },
        user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true
        }
    }, {timestamps: true}
);


const Book = mongoose.model("Book",bookSchema);

export default Book;