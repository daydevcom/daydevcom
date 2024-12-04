const videoElement = document.getElementById('inputVideo');
const canvasElement = document.getElementById('outputCanvas');
const canvasCtx = canvasElement.getContext('2d');

// Initialize FaceMesh
const faceMesh = new FaceMesh({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
});

faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
});

// Facial regions based on FaceMesh landmarks
const REGIONS = {
    FACE: [10, 152, 234, 454],
    LEFT_EYE: [362, 382, 381, 380, 374, 373],
    RIGHT_EYE: [133, 155, 154, 153, 145, 144],
    MOUTH: [78, 308, 324, 318, 87, 14],
    NOSE: [1, 4, 5, 197],
};

// Function to draw polygons for each region
function drawRegion(points, landmarks, color) {
    canvasCtx.beginPath();
    points.forEach((index, i) => {
        const point = landmarks[index];
        const x = point.x * canvasElement.width;
        const y = point.y * canvasElement.height;
        if (i === 0) canvasCtx.moveTo(x, y);
        else canvasCtx.lineTo(x, y);
    });
    canvasCtx.closePath();
    canvasCtx.strokeStyle = color;
    canvasCtx.lineWidth = 2;
    canvasCtx.stroke();
    canvasCtx.fillStyle = color + '33'; // Transparent fill
    canvasCtx.fill();
}

// Process FaceMesh results
faceMesh.onResults((results) => {
    // Resize canvas to match video dimensions
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;

    // Clear the canvas
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    // Draw the input video
    canvasCtx.drawImage(
        results.image,
        0,
        0,
        canvasElement.width,
        canvasElement.height
    );

    if (results.multiFaceLandmarks) {
        for (const landmarks of results.multiFaceLandmarks) {
            // Draw regions (face, eyes, mouth, nose)
            drawRegion(REGIONS.FACE, landmarks, '#ff0000'); // Red for Face
            drawRegion(REGIONS.LEFT_EYE, landmarks, '#00ff00'); // Green for Left Eye
            drawRegion(REGIONS.RIGHT_EYE, landmarks, '#00ff00'); // Green for Right Eye
            drawRegion(REGIONS.MOUTH, landmarks, '#0000ff'); // Blue for Mouth
            drawRegion(REGIONS.NOSE, landmarks, '#ffff00'); // Yellow for Nose
        }
    }
});

// Setup webcam
async function setupCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoElement.srcObject = stream;
    return new Promise((resolve) => {
        videoElement.onloadedmetadata = () => resolve(videoElement);
    });
}

// Start the app
async function startApp() {
    await setupCamera();
    videoElement.play();

    async function onFrame() {
        await faceMesh.send({ image: videoElement });
        requestAnimationFrame(onFrame);
    }

    onFrame();
}

startApp();
