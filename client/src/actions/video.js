import * as api from "../api";
import { updateUser } from "./currentUser";

export const uploadVideo = (videoData) => async (dispatch) => {
  try {
    const { fileData, fileOptions } = videoData;
    const {data}= await api.uploadVideo(fileData, fileOptions)
    dispatch({type:'POST_VIDEO',data})
    dispatch(getAllVideo())
  } catch (error) {
    alert(error.response.data.message)
  }
};

export const getAllVideo=()=> async (dispatch)=>{
  try {
    const {data}= await api.getVideos();
    dispatch({type:'FETCH_ALL_VIDEOS',payload:data})
  } catch (error) {
      console.log(error)
  }
}

export const likeVideo=(LikeDate)=>async(dispatch)=>{
  try {
    const {id,Like}=LikeDate;
    const {data}= await api.likeVideo(id,Like);
    dispatch({type:"POST_LIKE",payload:data})
    dispatch(getAllVideo());
  } catch (error) {
    console.log(error)
  }
}

export const viewVideo=(ViewDate)=>async(dispatch)=>{
  try {
    const {id}=ViewDate;
    console.log(id)
    const {data}= await api.viewsVideo(id)
    dispatch({type:'POST_VIEWS',data})
    dispatch(getAllVideo())
  } catch (error) {
    console.log(error)
  }
}

export const addPoints=(ViewDate)=>async(dispatch)=>{
  try {
    const { id, Viewer } = ViewDate;
    console.log(id, Viewer)
    const {data} = await api.addPoints(id, Viewer)
    dispatch(updateUser(data))
    console.log('User Updated',data)
  } catch (error) {
    console.log(error)
  }
}
