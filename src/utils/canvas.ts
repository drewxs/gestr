type Coordinate = [number, number, number];

interface Prediction {
  landmarks: Coordinate[];
}

const fingerJoints: number[][] = [
  [0, 1, 2, 3, 4], // thumb
  [0, 5, 6, 7, 8], // index finger
  [0, 9, 10, 11, 12], // middle finger
  [0, 13, 14, 15, 16], // ring finger
  [0, 17, 18, 19, 20], // pinky
];

export const drawHand = (predictions: Prediction[], ctx: CanvasRenderingContext2D) => {
  if (predictions.length > 0) {
    predictions.forEach((prediction) => {
      const landmarks = prediction.landmarks;

      for (let i = 0; i < fingerJoints.length; i++) {
        for (let j = 0; j < fingerJoints[i].length - 1; j++) {
          const firstJointIndex = fingerJoints[i][j];
          const secondJointIndex = fingerJoints[i][j + 1];

          ctx.beginPath();
          ctx.moveTo(landmarks[firstJointIndex][0], landmarks[firstJointIndex][1]);
          ctx.lineTo(landmarks[secondJointIndex][0], landmarks[secondJointIndex][1]);

          ctx.strokeStyle = 'grey';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      for (let i = 0; i < landmarks.length; i++) {
        const x = landmarks[i][0];
        const y = landmarks[i][1];

        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 3 * Math.PI);

        ctx.fillStyle = '#00ffff';
        ctx.fill();
      }
    });
  }
};
