import React from "react";
import LeftSidebar from "../../Components/LeftSidebar/LeftSidebar";
import VideoCall from "../../Components/VideoCall/VideoCall";

function VideoCallPage() {
  return (
    <div className="container_Pages_App">
      <LeftSidebar />
      <div style={{marginLeft: '20px',width:'100%'}}>
        <VideoCall />
      </div>
    </div>
  );
}

export default VideoCallPage;
