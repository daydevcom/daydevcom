// URL to your Teachable Machine model
const URL = "./my_model/";

let model, webcam, labelContainer, maxPredictions;
let isProcessing = false; // State to prevent multiple saves

// Load the image model and setup the webcam
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // Load the model and metadata
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Setup the webcam
    const flip = true; // Flip the webcam
    webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
    await webcam.setup(); // Request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // Append webcam to DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");

    // Clear label container
    labelContainer.innerHTML = '';
}

// Continuous loop for webcam frame updates and predictions
async function loop() {
    webcam.update(); // Update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

// Function to save data to Firestore
async function saveToFirestore(name) {
    const now = new Date();
    const timestamp = now.toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'medium' }); // Format: 29/11/2024 HH:mm:ss
    const todayDate = now.toLocaleDateString('en-GB'); // Format: 29/11/2024

    const querySnapshot = await db.collection("attendance")
        .where("name", "==", name)
        .where("date", "==", todayDate)
        .get();

    let status = "checkin";

    if (!querySnapshot.empty) {
        const lastRecord = querySnapshot.docs[querySnapshot.docs.length - 1].data();
        status = lastRecord.status === "checkin" ? "checkout" : "checkin";
    }

    // Save record to Firestore
    await db.collection("attendance").add({
        name: name,
        status: status,
        timestamp: timestamp,
        date: todayDate
    });

    // After saving, start the countdown
    startCountdown();
}

// Function to handle countdown
function startCountdown() {
    const countdownDiv = document.getElementById('countdown');
    let countdown = 3;

    // Display initial countdown value
    countdownDiv.innerHTML = `กรุณายืนนิ่ง: ${countdown} วินาที`;

    const interval = setInterval(() => {
        countdown--;
        countdownDiv.innerHTML = `กรุณายืนนิ่ง: ${countdown} วินาที`;
        if (countdown === 0) {
            clearInterval(interval);
            window.location.href = "success.html"; // Redirect after countdown
        }
    }, 1000);
}

// Modified predict function
async function predict() {
    if (isProcessing) return; // Prevent further predictions if already processing

    const prediction = await model.predict(webcam.canvas);

    // Filter predictions with probability > 0.75
    const filteredPrediction = prediction.filter(pred => pred.probability > 0.75);

    // If a valid prediction is found, start the process
    if (filteredPrediction.length > 0) {
        isProcessing = true; // Set processing flag to true
        const topPrediction = filteredPrediction[0];
        labelContainer.innerHTML = `พนักงาน: ${topPrediction.className}`;
        const name = topPrediction.className;

        // Save to Firestore and start countdown
        await saveToFirestore(name);

        // Reset processing flag after 5 seconds (if needed)
        setTimeout(() => {
            isProcessing = false; // Allow future processing after delay
        }, 5000);
    }
}
