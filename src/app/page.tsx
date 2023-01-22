'use client';

import { Inter } from '@next/font/google';
import * as model from '@tensorflow-models/handpose';
import * as _tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import { useRef } from 'react';
import Webcam from 'react-webcam';

import { drawHand } from '@/utils';

import styles from './page.module.css';

const inter = Inter({ subsets: ['latin'] });

const Home = () => {
  const webcamRef = useRef<Webcam>(null!);
  const canvasRef = useRef<HTMLCanvasElement>(null!);

  const load = async () => {
    const net: model.HandPose = await model.load();
    console.log('model loaded');

    setInterval(() => {
      detect(net);
    }, 50);
  };

  const detect = async (net: model.HandPose) => {
    if (webcamRef.current?.video?.readyState === 4) {
      const video = webcamRef.current.video;
      const width = webcamRef.current.video.videoWidth;
      const height = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = width;
      webcamRef.current.video.height = height;

      canvasRef.current.width = width;
      canvasRef.current.height = height;

      const hand = await net.estimateHands(video);

      const ctx = canvasRef.current.getContext('2d')!;
      drawHand(hand, ctx);
    }
  };

  load();

  return (
    <main className={inter.className}>
      <Webcam ref={webcamRef} className={styles['webcam']} />
      <canvas ref={canvasRef} className={styles['canvas']} />
    </main>
  );
};

export default Home;
