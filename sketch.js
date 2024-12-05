let video;

let bodyPose;

let prevX = 0;
let prevY = 0;

poses = [];

function preload() {
  bodyPose = ml5.bodyPose("MoveNet", { flipped: false });
}

function gotPoses(results) {
  poses = results;
}

function mousePressed() {
  console.log(poses);
}

function setup() {
  createCanvas(innerWidth, innerHeight, WEBGL);
  video = createCapture(VIDEO, { flipped:true });
  video.hide();

  bodyPose.detectStart(video, gotPoses);
}

function draw() {
  image(video, 0, 0);
  jokerNose();
  if (poses.length > 0) {
    let pose = poses[0];
    for (let i = 0; i < pose.keypoints.length; i++) {
      let keypoint = pose.keypoints[i];
      fill(0, 255, 0); 
      noStroke();
      if (keypoint.confidence > 0.3) {
        circle(keypoint.x, keypoint.y, 12);
      }
    }  
  }
}

function jokerNose() {
  // Draw keypoints if pose detection has started
  if (poses.length > 0) {
    let pose = poses[0];
    let x = pose.nose.x;
    let y = pose.nose.y;
    let lerpAmount = 0.3;

    // Interpolate between previous and current positions
    let lerpedX = lerp(prevX, x, lerpAmount); // Adjust the last parameter (0.1) for smoother/slower interpolation
    let lerpedY = lerp(prevY, y, lerpAmount);

    // Draw the interpolated position
    fill(255, 0, 0);
    circle(lerpedX, lerpedY, 40); // smoothened keypoints
    // circle(smoothenKeypoints(x, lerpAmount), smoothenKeypoints(y, lerpAmount), 40);
    // stroke(255, 255, 0 , 255);
    // circle(x, y, 10);

    // Update previous positions
    prevX = lerpedX;
    prevY = lerpedY;
  }
}

// function smoothenKeypoints(x, lerpAmount) {
//   let prevX = 0;
//   let lerpedX = lerp(prevX, x, lerpAmount);
//   return lerpedX;
  
// }