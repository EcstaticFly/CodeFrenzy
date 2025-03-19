import mongoose from 'mongoose';

const contestSchema = new mongoose.Schema({
  contestId: String,
  site: String,
  title: String,
  startTime: Date,
  duration: Number,
  endTime: Date,
  contestStatus: String,
  url: String,
  youtubeLink: String,
});

const Contest = mongoose.model('Contest', contestSchema);
export default Contest;
