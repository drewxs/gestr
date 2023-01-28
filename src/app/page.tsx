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
    setInterval(() => detect(net), 50);
  };

  const detect = async (net: model.HandPose) => {
    if (webcamRef.current?.video?.readyState === 4) {
      const video = webcamRef.current.video;
      const canvas = canvasRef.current;

      video.width = canvas.width = video.videoWidth;
      video.height = canvas.height = video.videoHeight;

      const hand = await net.estimateHands(video);

      if (hand.length > 0) {
        const GE = new fp.GestureEstimator([
          fp.Gestures.VictoryGesture,
          fp.Gestures.ThumbsUpGesture,
        ]);

        const estimation = await GE.estimate(hand[0].landmarks, 8);

        if (estimation.gestures?.length > 0) {
          const confidence = estimation.gestures.map(
            (prediction: { score: number }) => prediction.score,
          );
          const maxConfidence = confidence.indexOf(Math.max.apply(null, confidence));
          setGesture(estimation.gestures[maxConfidence].name);
        } else {
          setGesture('');
        }
      } else {
        setGesture('');
      }

      const ctx = canvas.getContext('2d')!;
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
