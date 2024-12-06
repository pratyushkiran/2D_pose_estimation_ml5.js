let video;

let bodyPose;

let lerpedX = 0;
let lerpedY = 0;

let lerpAmount = 0.4;

poses = [];

let videoWidth, videoHeight, videoOffsetX, videoOffsetY;

function preload() {
  bodyPose = ml5.bodyPose("Movenet", { flipped: true }); 

  // bodyPose = ml5.bodyPose("BlazePose", { flipped: true }); // for more keypoints and 3d poses
}

function gotPoses(results) {
  poses = results;
}

function mousePressed() {
  console.log(poses);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO, {flipped: true});
  video.size(640, 480); // Default video dimensions (you can adjust if needed)
  video.hide();

  bodyPose.detectStart(video, gotPoses);
  connections = bodyPose.getSkeleton();
  console.log(connections);
}

function draw() {
  background(0);
  maintainAspectRatio();

  image(video, videoOffsetX, videoOffsetY, videoWidth, videoHeight);

  if (poses.length > 0) {
    let pose = poses[0];

    let x = map(pose.nose.x, 0, video.width, videoOffsetX, videoOffsetX + videoWidth);
    let y = map(pose.nose.y, 0, video.height, videoOffsetY, videoOffsetY + videoHeight);

    lerpedX = lerp(lerpedX, x, lerpAmount);
    lerpedY = lerp(lerpedY, y, lerpAmount);

    fill(255, 0, 0);
    circle(lerpedX, lerpedY, 40);


    for (let i = 0; i < pose.keypoints.length; i++) {
      let keypoint = pose.keypoints[i];
      if (keypoint.confidence > 0.3) {
        // Scale keypoints to match the video on canvas
        let x = map(keypoint.x, 0, video.width, videoOffsetX, videoOffsetX + videoWidth);
        let y = map(keypoint.y, 0, video.height, videoOffsetY, videoOffsetY + videoHeight);

        fill(0, 255, 0);
        noStroke();
        circle(x, y, 12);
      }
    }

    // Draw connections between keypoints
    for (let i = 0; i < connections.length; i++) {
      let connection = connections[i];
      let a = connection[0];
      let b = connection[1];

      let keyPointA = pose.keypoints[a];
      let keyPointB = pose.keypoints[b];

      if (keyPointA.confidence > 0.3 && keyPointB.confidence > 0.3) {
        let x1 = map(keyPointA.x, 0, video.width, videoOffsetX, videoOffsetX + videoWidth);
        let y1 = map(keyPointA.y, 0, video.height, videoOffsetY, videoOffsetY + videoHeight);
        let x2 = map(keyPointB.x, 0, video.width, videoOffsetX, videoOffsetX + videoWidth);
        let y2 = map(keyPointB.y, 0, video.height, videoOffsetY, videoOffsetY + videoHeight);

        stroke(0, 255, 0);
        strokeWeight(4);
        line(x1, y1, x2, y2);
      }
    }
  }
}

function maintainAspectRatio() {
  let videoAspectRatio = video.width / video.height;
  let canvasAspectRatio = width / height;

  if (canvasAspectRatio > videoAspectRatio) {
    // Canvas is wider than video
    videoHeight = height;
    videoWidth = videoHeight * videoAspectRatio;
    videoOffsetX = (width - videoWidth) / 2;
    videoOffsetY = 0;
  } else {
    // Canvas is taller than video
    videoWidth = width;
    videoHeight = videoWidth / videoAspectRatio;
    videoOffsetX = 0;
    videoOffsetY = (height - videoHeight) / 2;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
