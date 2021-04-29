

import React, { useState, useEffect ,useRef} from "react";

export default function Candidate() {
  const url = 'ws://4cabebe43dbc.ngrok.io'
  const email = 'rishi'
  const quizId = '80'
  const [username, setUsername] = useState("");
  const offer = useRef('')
  const candidates = useRef([]);
  const [localStream, setLocalStream] = useState("");
  const [remoteStream, setRemoteStream] = useState("");
  const [webSocket, insertWebSocket] = useState(new WebSocket(`${url}/candidate?email=${email}&qid=${quizId}`))
  const [peerConn, setPeerConn] = useState(null);
  webSocket.onmessage = (event) => {
    console.log(event.data)
    // handleSignallingData(JSON.parse(event.data));
  };
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
  const sendData = (data) => {
    // data.username = username;
    console.log(`sending data:`)
    console.log(data)
    webSocket.send(JSON.stringify(data));
  };
  // const sendUsername = () => {
  //   setUsername(document.getElementById("username-input").value);
  //   sendData({
  //     type: "store_user",
  //   });
  // };

  const handleSignallingData = (data) => {
    console.log("data received")
    console.log(data)
    switch (data.type) {
      case "sdp":
        peerConn.setRemoteDescription(data.sdp);
        break;
      case "candidate":
        peerConn.addIceCandidate(data.candidate);
    }
  };

  const createAndSendOffer = () => {
    console.log("create and sending the offer")
    peerConn.createOffer(
      (Offer) => {
        // sendData({
        //   type: "sdp",
        //   sdp: offer.sdp,
        // });
        
        // console.log(Offer)
        offer.current = Offer
        peerConn.setLocalDescription(Offer);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  const handleLocalStream = (stream) => {
    const video = document.getElementById('local-video');
    video.srcObject = stream;
    setLocalStream(stream);
  };

  const videoError = (err) => {
    console.log(err.name, err);
  };

  const startCall = () => {
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
      document.getElementById("remote-video").srcObject = e.stream
      setRemoteStream(e.stream);
    };
    peerConn.onicecandidate = (e) => {
      if(e.candidate == null){
        sendData({
          type:'candidate',
          candidates:candidates.current[candidates.current.length-1],
          sdp:offer.current
        })
        return
      }
      let c = candidates.current
      c.push(e.candidate)
      // console.log(c)
      candidates.current = c
    };
    createAndSendOffer();
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
        <button onClick={startCall}>Start Call</button>
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
