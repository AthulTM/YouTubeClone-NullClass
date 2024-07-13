import React, { useEffect, useRef, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Comments from "../../Components/Comments/Comments";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import LikeWatchLaterSaveBtns from "./LikeWatchLaterSaveBtns";
import "./VideoPage.css";
import { addToHistory } from "../../actions/History";
import { viewVideo, addPoints } from "../../actions/video";

function VideoPage() {
  const { vid } = useParams();
  const vids = useSelector((state) => state.videoReducer);
  const vv = vids?.data.find((q) => q._id === vid);
  const dispatch = useDispatch();
  const CurrentUser = useSelector((state) => state?.currentUserReducer);
  const videoRef = useRef(null);
  const commentsRef = useRef(null);
  const holdTimeoutRef = useRef(null);
  const [leftTapCount, setLeftTapCount] = useState(0);
  const [rightTapCount, setRightTapCount] = useState(0);
  const [middleTapCount, setMiddleTapCount] = useState(0);
  const [locationAndTemp, setLocationAndTemp] = useState(null);
  const leftTapTimeoutRef = useRef(null);
  const rightTapTimeoutRef = useRef(null);
  const middleTapTimeoutRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (vv) {
      console.log("Video Data:", vv);
    } else {
      console.log("No video data found for vid:", vid);
    }
  }, [vv]);

  const handleHistory = () => {
    if (CurrentUser) {
      dispatch(
        addToHistory({
          videoId: vid,
          Viewer: CurrentUser?.result._id,
        })
      );
    }
  };

  const handleViews=()=>{
    dispatch( viewVideo({
      id:vid
    }))
  }

  const handlePoints = () => {
    dispatch( addPoints({
      id:vid,
      Viewer: CurrentUser?.result._id,
    }))
    console.log("Points Added")
  };
  
  useEffect(() => {
    if (CurrentUser) {
      handleHistory();
    }
    handleViews();
    const video = videoRef.current;
    if (video) {
      video.addEventListener('ended', handlePoints);
    }

    return () => {
      if (video) {
        video.removeEventListener('ended', handlePoints);
      }
    };

  }, [vid]);

  const handleDoubleClick = (e) => {
    const video = videoRef.current;
    if (video) {
      const boundingRect = video.getBoundingClientRect();
      const clickPositionX = e.clientX - boundingRect.left;

      if (clickPositionX > boundingRect.width / 2) {
        video.currentTime += 10; // Right side double-tap
      } else {
        video.currentTime -= 10; // Left side double-tap
      }
    }
  };

  const handleMouseDown = (e) => {
    const video = videoRef.current;
    if (video) {
      const boundingRect = video.getBoundingClientRect();
      const clickPositionX = e.clientX - boundingRect.left;

      holdTimeoutRef.current = setTimeout(() => {
        if (clickPositionX > boundingRect.width / 2) {
          video.playbackRate = 2; // Right side hold
        } else {
          video.playbackRate = 0.5; // Left side hold
        }
      }, 500); // Adjust delay as needed
    }
  };

  const handleMouseUp = () => {
    const video = videoRef.current;
    if (video) {
      clearTimeout(holdTimeoutRef.current);
      video.playbackRate = 1; // Reset speed
    }
  };

  const handleMouseLeave = () => {
    const video = videoRef.current;
    if (video) {
      clearTimeout(holdTimeoutRef.current);
      video.playbackRate = 1; // Reset speed
    }
  };

  const handleTripleTap = (e) => {
    const boundingRect = videoRef.current.getBoundingClientRect();
    const clickPositionX = e.clientX - boundingRect.left;
    const middleStart = boundingRect.width / 3;
    const middleEnd = (2 * boundingRect.width) / 3;

    if (clickPositionX <= boundingRect.width / 3) {
      setLeftTapCount(leftTapCount + 1);

      if (leftTapTimeoutRef.current) {
        clearTimeout(leftTapTimeoutRef.current);
      }

      leftTapTimeoutRef.current = setTimeout(() => {
        setLeftTapCount(0);
      }, 500); // 500ms window for triple tap

      if (leftTapCount === 2) {
        commentsRef.current.scrollIntoView({ behavior: "smooth" });
        setLeftTapCount(0);
      }
    } else if (clickPositionX >= (2 * boundingRect.width) / 3) {
      setRightTapCount(rightTapCount + 1);

      if (rightTapTimeoutRef.current) {
        clearTimeout(rightTapTimeoutRef.current);
      }

      rightTapTimeoutRef.current = setTimeout(() => {
        setRightTapCount(0);
      }, 500); // 500ms window for triple tap

      if (rightTapCount === 2) {
        window.close();
        setRightTapCount(0);
      }
    } else {
      setMiddleTapCount(middleTapCount + 1);

      if (middleTapTimeoutRef.current) {
        clearTimeout(middleTapTimeoutRef.current);
      }

      middleTapTimeoutRef.current = setTimeout(() => {
        setMiddleTapCount(0);
      }, 500); // 500ms window for triple tap

      if (middleTapCount === 2) {
        // Assuming `nextVideoId` is the ID of the next video to play
        const nextVideoId = getNextVideoId(); // Implement this function based on your logic
        if (nextVideoId) {
          navigate(`/videopage/${nextVideoId}`);
        }
        setMiddleTapCount(0);
      }
    }
  };

  // Dummy function to get next video ID, replace with your logic
  const getNextVideoId = () => {
    const currentIndex = vids?.data.findIndex((video) => video._id === vid);
    if (currentIndex !== -1 && currentIndex + 1 < vids.data.length) {
      return vids.data[currentIndex + 1]._id;
    }
    return null;
  };

  const handleSingleTapTopRight = async (e) => {
    const video = videoRef.current;
    if (video) {
      const boundingRect = video.getBoundingClientRect();
      const clickPositionX = e.clientX - boundingRect.left;
      const clickPositionY = e.clientY - boundingRect.top;

      if (
        clickPositionX > boundingRect.width * 0.9 &&
        clickPositionY < boundingRect.height * 0.1
      ) {
        // Top right corner tap
        const position = await getCurrentPosition();
        if (position) {
          const weather = await getWeather(position.coords.latitude, position.coords.longitude);
          if (weather) {
            setLocationAndTemp(
              `Location: ${weather.location.name}, Temperature: ${weather.current.temp_c}°C`
            );
            setTimeout(() => {
              setLocationAndTemp(null);
            }, 5000); // Hide the popup after 5 seconds
          }
        }
      }
    }
  };

  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  const getWeather = async (lat, lon) => {
    const apiKey = "a379da1c007f4b0798972427243006"; // Replace with your WeatherAPI key
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}&aqi=no`
    );
    if (response.ok) {
      return response.json();
    } else {
      return null;
    }
  };

  if (!vv) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container_videoPage">
      <div className="container2_videoPage">
        <div
          className="video_display_screen_videoPage"
          onDoubleClick={handleDoubleClick}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onClick={(e) => {
            handleTripleTap(e);
            handleSingleTapTopRight(e);
          }}
        >
          <video
            ref={videoRef}
             //src={`http://localhost:5000/${vv?.filePath}`}
            src={`https://youtubeclone-nullclass.onrender.com/${vv?.filePath}`}
            className="video_ShowVideo_videoPage"
            controls
          ></video>
          {locationAndTemp && (
            <div className="location-temp-popup">
              {locationAndTemp}
            </div>
          )}
          <div className="video_details_videoPage">
            <div className="video_btns_title_VideoPage_cont">
              <p className="video_title_VideoPage"> {vv?.videoTitle}</p>
              <div className="views_date_btns_VideoPage">
                <div className="views_videoPage">
                  {vv?.Views} views <div className="dot"></div>{" "}
                  {moment(vv?.createdAt).fromNow()}
                </div>
                <LikeWatchLaterSaveBtns vv={vv} vid={vid} />
              </div>
            </div>
            <Link
              to={`/chanel/${vv?.videoChanel}`}
              className="chanel_details_videoPage"
            >
              <b className="chanel_logo_videoPage">
                <p>{vv?.Uploder.charAt(0).toUpperCase()}</p>
              </b>
              <p className="chanel_name_videoPage">{vv?.Uploder}</p>
            </Link>
            <div className="comments_VideoPage" ref={commentsRef}>
              <h2>
                <u>Comments</u>
              </h2>
              <Comments videoId={vv._id} />
            </div>
          </div>
        </div>
        <div className="moreVideoBar">More video</div>
      </div>
    </div>
  );
}

export default VideoPage;
