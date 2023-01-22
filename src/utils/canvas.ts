type Coordinate = [number, number, number];

interface Prediction {
  landmarks: Coordinate[];
}

interface FingerJoints {
  [key: string]: [number, number, number, number, number];
}

const fingerJoints: FingerJoints = {
  thumb: [0, 1, 2, 3, 4],
  indexFinger: [0, 5, 6, 7, 8],
  middleFinger: [0, 9, 10, 11, 12],
  ringFinger: [0, 13, 14, 15, 16],
  pinky: [0, 17, 18, 19, 20],
};

export const drawHand = (predictions: Prediction[], ctx: CanvasRenderingContext2D) => {
  if (predictions.length > 0) {
    predictions.forEach((prediction) => {
      const landmarks = prediction.landmarks;

      for (const finger in fingerJoints) {
        for (let j = 0; j < fingerJoints[finger].length - 1; j++) {
          const firstJointIndex = fingerJoints[finger][j];
          const secondJointIndex = fingerJoints[finger][j + 1];

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

        ctx.fillStyle = 'cyan';
        ctx.fill();
      }
    });
  }
};
