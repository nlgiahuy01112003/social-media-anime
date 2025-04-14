import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';

const socket = io('http://localhost:5000', {
  auth: { token: localStorage.getItem('token') },
});

function VideoCallPage() {
  const { userId } = useParams();
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerConnection = useRef();
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  useEffect(() => {
    const startWebRTC = async () => {
      peerConnection.current = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      });

      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localVideoRef.current.srcObject = stream;
      stream.getTracks().forEach((track) => peerConnection.current.addTrack(track, stream));

      peerConnection.current.ontrack = (event) => {
        remoteVideoRef.current.srcObject = event.streams[0];
      };

      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('ice-candidate', { candidate: event.candidate, receiverId: userId });
        }
      };

      socket.on('offer', async (offer) => {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);
        socket.emit('answer', { answer, receiverId: userId });
      });

      socket.on('answer', async (answer) => {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
      });

      socket.on('ice-candidate', async (candidate) => {
        await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
      });

      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      socket.emit('offer', { offer, receiverId: userId });
    };

    startWebRTC();

    return () => {
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
    };
  }, [userId]);

  const toggleMic = () => {
    const audioTrack = localVideoRef.current.srcObject.getAudioTracks()[0];
    audioTrack.enabled = !audioTrack.enabled;
    setMicOn(!micOn);
  };

  const toggleCam = () => {
    const videoTrack = localVideoRef.current.srcObject.getVideoTracks()[0];
    videoTrack.enabled = !videoTrack.enabled;
    setCamOn(!camOn);
  };

  return (
    <div className="min-h-screen bg-anime-gradient p-6">
      <motion.h1
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="text-3xl font-anime text-white text-center mb-6"
      >
        Video Call Anime 📹✨
      </motion.h1>
      <div className="max-w-4xl mx-auto flex space-x-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1"
        >
          <video
            ref={localVideoRef}
            autoPlay
            muted
            className="w-full rounded-2xl border-2 border-anime-pink"
          />
          <p className="text-center font-anime text-anime-purple mt-2">Bạn</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1"
        >
          <video
            ref={remoteVideoRef}
            autoPlay
            className="w-full rounded-2xl border-2 border-anime-blue"
          />
          <p className="text-center font-anime text-anime-purple mt-2">Người kia</p>
        </motion.div>
      </div>
      <div className="flex justify-center space-x-4 mt-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={toggleMic}
          className="p-2 bg-anime-purple text-white rounded-lg font-anime"
        >
          {micOn ? 'Tắt Mic 🎤' : 'Bật Mic 🎤'}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={toggleCam}
          className="p-2 bg-anime-purple text-white rounded-lg font-anime"
        >
          {camOn ? 'Tắt Cam 📹' : 'Bật Cam 📹'}
        </motion.button>
      </div>
    </div>
  );
}

export default VideoCallPage;