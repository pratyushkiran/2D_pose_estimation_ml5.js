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
  connections = bodyPose.getSkeleton();
  console.log(connections);
}

function draw() {
  
  image(video, 0, 0);

  jokerNose();

  // for detecting all the keypoints
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
    // for (let i = 0; i < connections.length(); i++) {
    //   let connection = connections[i];
    //   let a = connection[0];
    //   let b = connection[1];
    //   let keyPointA = pose.keypoints[a];
    //   let keyPointB = pose.keypoints[b];
    //   stroke(0, 255, 0);
    //   strokeWeight(8);
    //   line(keyPointA.x, keyPointA.y, keyPointB.x, keyPointB.y);
    // }
  }
}

function jokerNose(fun = null) {
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
    
    // Update previous positions
    prevX = lerpedX;
    prevY = lerpedY;
  }
}
