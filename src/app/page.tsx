'use client';

import { Inter } from '@next/font/google';
import * as model from '@tensorflow-models/handpose';
import * as _tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as fp from 'fingerpose';
import { useRef, useState } from 'react';
import Webcam from 'react-webcam';

import { drawHand } from '@/utils';

import styles from './page.module.css';

const inter = Inter({ subsets: ['latin'] });

const Home = () => {
  const [gesture, setGesture] = useState<string | null>(null);

  const webcamRef = useRef<Webcam>(null!);
  const canvasRef = useRef<HTMLCanvasElement>(null!);

  const load = async () => {
    const net: model.HandPose = await model.load();
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

      if (hand.length > 0) {
        const GE = new fp.GestureEstimator([
          fp.Gestures.VictoryGesture,
          fp.Gestures.ThumbsUpGesture,
        ]);

        const gesture = await GE.estimate(hand[0].landmarks, 8);

        if (gesture.gestures?.length > 0) {
          const confidence = gesture.gestures.map(
            (prediction: { score: number }) => prediction.score,
          );
          const maxConfidence = confidence.indexOf(Math.max.apply(null, confidence));
          setGesture(gesture.gestures[maxConfidence].name);
        } else {
          setGesture('');
        }
      } else {
        setGesture('');
      }

      const ctx = canvasRef.current.getContext('2d')!;
      drawHand(hand, ctx);
    }
  };

  load();

  return (
    <main className={[inter.className, styles['root']].join(' ')}>
      <Webcam ref={webcamRef} className={styles['webcam']} />
      <canvas ref={canvasRef} className={styles['canvas']} />
      <h1 className={styles['gesture']}>{gesture}</h1>
    </main>
  );
};

export default Home;
