import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema({
  userId: String,
  contestId: String,
});

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);
export default Bookmark;
