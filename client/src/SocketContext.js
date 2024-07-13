import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import SimplePeer from "simple-peer";

const SocketContext = createContext();

const socket = io('https://youtubeclone-nullclass.onrender.com/');
//const socket = io('http://localhost:5000/');

const ContextProvider = ({ children }) => {

  const [stream, setStream] = useState(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [yourID, setYourID] = useState("");
  const [friendID, setFriendID] = useState("");
  const [screenSharing, setScreenSharing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [recording, setRecording] = useState(false);
  const [inCall, setInCall] = useState(false);
  const userVideo = useRef();
  const partnerVideo = useRef();
  const screenStream = useRef();
  const mediaRecorder = useRef();
  const peerRef = useRef();


  useEffect(() => {


    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
      });

    socket.on("yourID", (id) => {
      setYourID(id);
    });

    socket.on("hey", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    });

    // Added this to handle end call event
    socket.on("callEnded", () => {
      endCall();
    });
  }, []);

  const callPeer = (id) => {
    const peer = new SimplePeer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: yourID,
      });
    });

    peer.on("stream", (stream) => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    peer.on("close", () => {
      endCall();
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      setInCall(true);
      peer.signal(signal);
    });

    peerRef.current = peer;
  };

  const acceptCall = () => {
    const peer = new SimplePeer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("acceptCall", { signal: data, to: caller });
    });

    peer.on("stream", (stream) => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    peer.on("close", () => {
      endCall();
    });

    peer.signal(callerSignal);
    setCallAccepted(true);
    setInCall(true);
    peerRef.current = peer;
  };

  const startScreenSharing = async () => {
    try {
      screenStream.current = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      setScreenSharing(true);
      replaceTrack(screenStream.current.getVideoTracks()[0]);
      if (userVideo.current) {
        userVideo.current.srcObject = screenStream.current;
      }
    } catch (error) {
      console.error("Error sharing screen:", error);
    }
  };

  const stopScreenSharing = () => {
    screenStream.current.getTracks().forEach((track) => track.stop());
    setScreenSharing(false);
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((newStream) => {
        setStream(newStream);
        replaceTrack(newStream.getVideoTracks()[0]);
        if (userVideo.current) {
          userVideo.current.srcObject = newStream;
        }
      });
  };

  const replaceTrack = (newTrack) => {
    const peer = peerRef.current;
    const sender = peer.streams[0].getVideoTracks()[0];
    peer.replaceTrack(sender, newTrack, peer.streams[0]);
  };

  const startRecording = () => {
    setRecording(true);
    mediaRecorder.current = new MediaRecorder(stream);
    mediaRecorder.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setRecordedChunks((prev) => [...prev, event.data]);
      }
    };
    mediaRecorder.current.start();
  };

  const stopRecording = () => {
    setRecording(false);
    mediaRecorder.current.stop();
    const blob = new Blob(recordedChunks, {
      type: "video/webm",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "recording.webm";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    setRecordedChunks([]);
  };

  const endCall = () => {
    if (peerRef.current) {
      peerRef.current.destroy();
    }
    setCallAccepted(false);
    setInCall(false);
    setReceivingCall(false);
    setCaller('');
    setCallerSignal(null);
    if (partnerVideo.current) {
      partnerVideo.current.srcObject = null;
    }
    // Emit endCall event to the other user
    socket.emit('endCall', { to: caller || friendID });
  };
    return (
        <SocketContext.Provider value={{ stream,receivingCall, caller, callerSignal, callAccepted, yourID, friendID, screenSharing,
            recordedChunks, recording, inCall, endCall, stopRecording, startRecording, replaceTrack, stopScreenSharing, startScreenSharing,
            acceptCall, callPeer, userVideo, partnerVideo, screenStream, mediaRecorder, peerRef ,socket, setFriendID
         }}>
            {children}
        </SocketContext.Provider>
    );
}

export { ContextProvider, SocketContext };