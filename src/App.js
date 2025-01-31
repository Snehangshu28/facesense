import { useRef } from 'react';
import './App.css';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as facemesh from '@tensorflow-models/facemesh';
import { drawMesh } from './utilities';

function App() {
  const webcamref = useRef(null);
  const canvasref = useRef(null);

  //load facemesh
  const runFacemesh = async () => {
    const net = await facemesh.load({
      inputResolution: { width: 640, height: 480 },
      scale: 0.8,
    });
    setInterval(() => {
      detect(net);
    }, 10);
  };

  //detect function
  const detect = async (net) => {
    if (
      typeof webcamref.current !== 'undefined' &&
      webcamref.current !== null &&
      webcamref.current.video.readyState === 4
    ) {
      //get video properties
      const video = webcamref.current.video;
      const videoWidth = webcamref.current.video.videoWidth;
      const videoHeight = webcamref.current.video.videoHeight;

      //set video width
      webcamref.current.video.width = videoWidth;
      webcamref.current.video.height = videoHeight;

      //set canvas width
      canvasref.current.width = videoWidth;
      canvasref.current.height = videoHeight;

      //make detections
      const face = await net.estimateFaces(video);
      console.log(face);

      //get canvas context for drawing
      const ctx = canvasref.current.getContext('2d');
      drawMesh(face, ctx);
    }
  };
  runFacemesh();
  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamref}
          style={{
            position: 'absolute',
            marginLeft: 'auto',
            marginRight: 'auto',
            left: 0,
            right: 0,
            textAlign: 'center',
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />
        <canvas
          ref={canvasref}
          style={{
            position: 'absolute',
            marginLeft: 'auto',
            marginRight: 'auto',
            left: 0,
            right: 0,
            textAlign: 'center',
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />
      </header>
    </div>
  );
}

export default App;
