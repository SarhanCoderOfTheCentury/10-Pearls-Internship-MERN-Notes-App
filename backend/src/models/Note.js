import mongoose from "mongoose";

const TAG_VALUES = ["work", "personal", "idea", "none"];

const noteSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true //remove extra whitespaces
    },
    content: {
        type: mongoose.Schema.Types.Mixed, //it means it can be anything, as in any datatypes
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", //references user collection
        required: true
    },
    isFavorite: {
        type: Boolean,
        default: false,
    },
    tag: {
        type: String,
        enum: TAG_VALUES,
        default: "none",
    },
}, { timestamps: true })

//creating an index for fast lookup of a user
noteSchema.index({user: 1})

//text index for fast search
noteSchema.index({title: "text", content: "text"})

// Compound indexes for filtering by favorites / tag
noteSchema.index({ user: 1, isFavorite: 1 });
noteSchema.index({ user: 1, tag: 1 });

export const NotesModel = mongoose.model("Note", noteSchema)
export { TAG_VALUES }


