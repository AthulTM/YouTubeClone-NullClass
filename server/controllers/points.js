import mongoose from "mongoose";
import users from "../models/auth.js";

export const pointsController = async (req, res) => {
    const { id: _id } = req.params;
    const { Viewer } = req.body; // Assume the Viewer ID is passed in the request body
  
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(404).send("Video Unavailable..");
    }
  
    try {
      let updatedUser;
      let newUser;
      // Find the user and update their viewed videos list
      const user = await users.findById(Viewer);
      if (!user) {
        return res.status(404).send("User not found");
      }
  
      // Check if the video ID is already in the user's list of viewed videos
      if (!user.viewedVideos.some((videoId) => videoId.equals(_id))) {
        // Update the user's viewed videos list
        updatedUser = await users.findByIdAndUpdate(Viewer, {
          $addToSet: { viewedVideos: _id },
        });
        newUser = await users.findById(Viewer);
      }
      else{
        newUser = user;
      }
  
      res.status(200).json(newUser);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };