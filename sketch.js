let video;

let bodyPose;

let lerpedX = 0;
let lerpedY = 0;

let lerpAmount = 0.4;

poses = [];

function preload() {
  bodyPose = ml5.bodyPose("MoveNet", { flipped:true });
}

function gotPoses(results) {
  poses = results;
}

function mousePressed() {
  console.log(poses);
}

function setup() {
  createCanvas(innerWidth, innerHeight);
  video = createCapture(VIDEO, { flipped:true });
  video.hide();

  bodyPose.detectStart(video, gotPoses);
  connections = bodyPose.getSkeleton();
  console.log(connections);
}

function draw() {
  image(video, 0, 0);

  if (poses.length > 0) {
    let pose = poses[0];
    let x = pose.nose.x;
    let y = pose.nose.y;

    lerpedX = lerp(lerpedX, x, lerpAmount); 
    lerpedY = lerp(lerpedY, y, lerpAmount);

    fill(255, 0, 0);
    noStroke();
    circle(lerpedX, lerpedY, 40); 

    // for detecting all the keypoints
    for (let i = 0; i < pose.keypoints.length; i++) {
      let keypoint = pose.keypoints[i];
      fill(0, 255, 0); 
      noStroke();
      if (keypoint.confidence > 0.3) {
        circle(keypoint.x, keypoint.y, 12);
      }
    }  

    // for connecting lines
    for (let i = 0; i < connections.length; i++) {
      let connection = connections[i];
      let a = connection[0];
      let b = connection[1];
      let keyPointA = pose.keypoints[a];
      let keyPointB = pose.keypoints[b];

      let confA = keyPointA.confidence;
      let confB = keyPointB.confidence;

      if (confA > 0.1 && confB > 0.1) {
        stroke(0, 255, 0);
        strokeWeight(4);
        line(keyPointA.x, keyPointA.y, keyPointB.x, keyPointB.y);
      }
    }

    // ================================================================= 
    // detect the left wrist and the right wrist and draw the nose radius according to the distance between two wrists
    // let rx = pose.right_wrist.x;
    // let ry = pose.right_wrist.y;

    // let lx = pose.left_wrist.x;
    // let ly = pose.left_wrist.y;

    // fill(0, 255, 0); 
    // circle(rx, ry, 12);
    
    // fill(0, 150, 0); 
    // circle(lx, ly, 12);

    // let d = dist(rx, ry, lx, ly);
    // fill(255, 0, 0);
    // circle(x, y, d);
    // ================================================================= 

  }
}

