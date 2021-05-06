import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
export default function HttpAdmin() {
  const [localStream, setlocalStream] = useState(null);
  const [remoteStream, setremoteStream] = useState(null);
  const [peerConn, setPeerConn] = useState(null);
  const candidateData = {
    offer: {},
    candidates: [],
  };
  const adminData = useRef({
    answer: {},
    candidates: [],
  });

  const configuration = {
    iceServers: [
      {
        urls: [
          "stun:stun.l.google.com:19302",
          // "stun:stun1.l.google.com:19302",
          // "stun:stun2.l.google.com:19302",
        ],
      },
    ],
  };

  const handleLocalStream = (stream) => {
    const video = document.getElementById("local-video");
    video.srcObject = stream;
    setlocalStream(stream);
  };

  const videoError = (err) => {
    console.log(err.name, err);
  };
  const refactorResponse = (res) => {};

  const createAndSendAnswer = () => {
    console.log("create and sending the answer");
    peerConn.createAnswer(
      (answer) => {
        peerConn.setLocalDescription(answer);
        adminData.answer = answer;

        console.log(answer);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  const joinCall = () => {
    axios.get("https://1fd91683bdb5.ngrok.io/adminserve?email=rishi&qid=80",{
      headers: {"Access-Control-Allow-Origin": "*"}
    })
      .then((response) => {
        console.log("response")
        console.log(response,response.data);
        // refactorResponse(response);
        // peerConn.setRemoteDescription(
        //   new RTCSessionDescription(candidateData.offer)
        // );
        // createAndSendAnswer();
        // candidateData.candidates.map((candidate) => {
        //   peerConn.addIceCandidate(candidate);
        // });

        // //   console.log(response.data)
        // console.log(JSON.parse(response.data));
      })
      .catch((err) => {
        console.log(err);
      });

    navigator.mediaDevices
      .getUserMedia({
        video: {
          frameRate: 24,
          width: {
            min: 480,
            ideal: 720,
            max: 1280,
          },
          aspectRatio: 1.33333,
        },
        audio: false,
      })
      .then((stream) => {
        console.log("peer conn added");
        handleLocalStream(stream);
        setPeerConn(new RTCPeerConnection(configuration));
      })
      .catch(videoError);
  };

  useEffect(() => {
    if (peerConn == null) {
      return;
    }
    console.log("peerConn is changed");

    peerConn.addStream(localStream);

    peerConn.onaddstream = (e) => {
      console.log("adding stream");
      document.getElementById("remote-video").srcObject = e.stream;
      setremoteStream(e.stream);
    };
    peerConn.onicecandidate = (e) => {
      if (e.candidate == null) {
        if (adminData.candidates.length > 0) {
          axios.post(
            "https://1fd91683bdb5.ngrok.io/adminserve?email=rishi&qid=80",

            adminData
          );
        }
        return;
      }
      adminData.candidates.push(e.candidate);
    };
  }, [peerConn]);

  return (
    <div>
      <div>
        <input
          placeholder="Enter username..."
          type="text"
          id="username-input"
        />
        <br />
        {/* <button onClick={sendUsername}>Send</button> */}
        <button onClick={joinCall}>Start Call</button>
      </div>
      <div id="video-call-div">
        <video src={localStream} muted id="local-video" autoPlay></video>
        <video src={remoteStream} id="remote-video" autoPlay></video>
        <div className="call-action-div">
          {/* <button onclick={muteVideo}>Mute Video</button> */}
          {/* <button onclick={muteAudio}>Mute Audio</button> */}
        </div>
      </div>
    </div>
  );
}
