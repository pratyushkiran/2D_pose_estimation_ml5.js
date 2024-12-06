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
  createCanvas(innerWidth, innerHeight);
  video = createCapture(VIDEO, { flipped:false });
  video.hide();

  bodyPose.detectStart(video, gotPoses);
  connections = bodyPose.getSkeleton();
  console.log(connections);
}

function draw() {
s
  image(video, 0, 0);


  if (poses.length > 0) {

    let pose = poses[0];

    let x = pose.nose.x;
    let y = pose.nose.y;

    let lerpAmount = 0.4;

    // Interpolate between previous and current positions
    let lerpedX = lerp(prevX, x, lerpAmount); // Adjust the last parameter (0.1) for smoother/slower interpolation
    let lerpedY = lerp(prevY, y, lerpAmount);

    // Draw the interpolated position
    fill(255, 0, 0);
    circle(lerpedX, lerpedY, 40); // smoothened keypoints
    
    // Update previous positions
    prevX = lerpedX;
    prevY = lerpedY;

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

      // if (confA > 0.1 && confB > 0.1) {
      stroke(0, 255, 0);
      strokeWeight(4);
      line(keyPointA.x, keyPointA.y, keyPointB.x, keyPointB.y);
      // }
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

