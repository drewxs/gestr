'use client';

import * as model from '@tensorflow-models/handpose';
import * as _tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import { useCallback, useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';

import { GE, drawHand, emoji } from '@/utils';

import styles from './page.module.css';

const Home = () => {
  const [gesture, setGesture] = useState<string | null>(null);

  const webcamRef = useRef<Webcam>(null!);
  const canvasRef = useRef<HTMLCanvasElement>(null!);

  const load = useCallback(async () => {
    const net: model.HandPose = await model.load();
    setInterval(() => detect(net), 25);
  }, []);

  const detect = async (net: model.HandPose) => {
    if (webcamRef.current?.video?.readyState === 4) {
      const video = webcamRef.current.video;
      const canvas = canvasRef.current;

      video.width = canvas.width = video.videoWidth;
      video.height = canvas.height = video.videoHeight;

      const hand = await net.estimateHands(video);

      if (hand.length > 0) {
        const estimation = await GE.estimate(hand[0].landmarks, 8);

        if (estimation.gestures?.length > 0) {
          const confidence = estimation.gestures.map(
            (prediction: { score: number }) => prediction.score,
          );
          const maxConfidence = confidence.indexOf(Math.max.apply(null, confidence));
          setGesture(emoji[estimation.gestures[maxConfidence].name]);
        } else {
          setGesture(null);
        }
      } else {
        setGesture(null);
      }

      const ctx = canvas.getContext('2d')!;
      drawHand(hand, ctx);
    }
  };

  useEffect(() => {
    load();
  }, [load]);

  return (
    <main className={styles['root']}>
      <Webcam ref={webcamRef} className={styles['webcam']} />
      <canvas ref={canvasRef} className={styles['canvas']} />
      {gesture && <h1 className={styles['gesture']}>{gesture}</h1>}
    </main>
  );
};

export default Home;
