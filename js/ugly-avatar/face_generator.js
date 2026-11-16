/*
 * Adapted from "ugly-avatar" by Xuan Tang (txstc55): https://github.com/txstc55/ugly-avatar
 * Based on src/views/FaceGenerator.vue @ commit 220838e8.
 * Licensed under CC BY-NC 4.0: https://creativecommons.org/licenses/by-nc/4.0/
 * (full license text in ./LICENSE)
 *
 * Changes from the original:
 *  - Ported from a Vue 3 component to plain JavaScript (no build step); the SVG
 *    markup and all random parameters are the same as the original template.
 *  - The PNG download is always 500x500, even when the SVG is shown smaller on
 *    narrow screens (the original sized the canvas from the on-screen size).
 *  - The space key no longer scrolls the page or re-triggers a focused button.
 *  - feTurbulence type="noise" (not a valid value; browsers log an error and
 *    fall back to the default) is written as type="turbulence", the value
 *    browsers were already using, so the drawing is unchanged.
 */
import * as faceShape from "./face_shape.js";
import * as eyeShape from "./eye_shape.js";
import * as hairLines from "./hair_lines.js";
import * as mouthShape from "./mouth_shape.js";

function randomFromInterval(min, max) {
  // min and max included
  return Math.random() * (max - min) + min;
}

const SVG_SIZE = 500;

const hairColors = [
  "rgb(0, 0, 0)", // Black
  "rgb(44, 34, 43)", // Dark Brown
  "rgb(80, 68, 68)", // Medium Brown
  "rgb(167, 133, 106)", // Light Brown
  "rgb(220, 208, 186)", // Blond
  "rgb(233, 236, 239)", // Platinum Blond
  "rgb(165, 42, 42)", // Red
  "rgb(145, 85, 61)", // Auburn
  "rgb(128, 128, 128)", // Grey
  "rgb(185, 55, 55)", // Fire
  "rgb(255, 192, 203)", // Pastel Pink
  "rgb(255, 105, 180)", // Bright Pink
  "rgb(230, 230, 250)", // Lavender
  "rgb(64, 224, 208)", // Turquoise
  "rgb(0, 191, 255)", // Bright Blue
  "rgb(148, 0, 211)", // Deep Purple
  "rgb(50, 205, 50)", // Lime Green
  "rgb(255, 165, 0)", // Vivid Orange
  "rgb(220, 20, 60)", // Crimson Red
  "rgb(192, 192, 192)", // Silver
  "rgb(255, 215, 0)", // Gold
  "rgb(255, 255, 255)", // White
  "rgb(124, 252, 0)", // Lawn Green
  "rgb(127, 255, 0)", // Chartreuse
  "rgb(0, 255, 127)", // Spring Green
  "rgb(72, 209, 204)", // Medium Turquoise
  "rgb(0, 255, 255)", // Cyan
  "rgb(0, 206, 209)", // Dark Turquoise
  "rgb(32, 178, 170)", // Light Sea Green
  "rgb(95, 158, 160)", // Cadet Blue
  "rgb(70, 130, 180)", // Steel Blue
  "rgb(176, 196, 222)", // Light Steel Blue
  "rgb(30, 144, 255)", // Dodger Blue
  "rgb(135, 206, 235)", // Sky Blue
  "rgb(0, 0, 139)", // Dark Blue
  "rgb(138, 43, 226)", // Blue Violet
  "rgb(75, 0, 130)", // Indigo
  "rgb(139, 0, 139)", // Dark Magenta
  "rgb(153, 50, 204)", // Dark Orchid
  "rgb(186, 85, 211)", // Medium Orchid
  "rgb(218, 112, 214)", // Orchid
  "rgb(221, 160, 221)", // Plum
  "rgb(238, 130, 238)", // Violet
  "rgb(255, 0, 255)", // Magenta
  "rgb(216, 191, 216)", // Thistle
  "rgb(255, 20, 147)", // Deep Pink
  "rgb(255, 69, 0)", // Orange Red
  "rgb(255, 140, 0)", // Dark Orange
  "rgb(255, 165, 0)", // Orange
  "rgb(250, 128, 114)", // Salmon
  "rgb(233, 150, 122)", // Dark Salmon
  "rgb(240, 128, 128)", // Light Coral
  "rgb(205, 92, 92)", // Indian Red
  "rgb(255, 99, 71)", // Tomato
  "rgb(255, 160, 122)", // Light Salmon
  "rgb(220, 20, 60)", // Crimson
  "rgb(139, 0, 0)", // Dark Red
  "rgb(178, 34, 34)", // Fire Brick
  "rgb(250, 235, 215)", // Antique White
  "rgb(255, 239, 213)", // Papaya Whip
  "rgb(255, 235, 205)", // Blanched Almond
  "rgb(255, 222, 173)", // Navajo White
  "rgb(245, 245, 220)", // Beige
  "rgb(255, 228, 196)", // Bisque
  "rgb(255, 218, 185)", // Peach Puff
  "rgb(244, 164, 96)", // Sandy Brown
  "rgb(210, 180, 140)", // Tan
  "rgb(222, 184, 135)", // Burly Wood
  "rgb(250, 250, 210)", // Light Goldenrod Yellow
  "rgb(255, 250, 205)", // Lemon Chiffon
  "rgb(255, 245, 238)", // Sea Shell
  "rgb(253, 245, 230)", // Old Lace
  "rgb(255, 228, 225)", // Misty Rose
  "rgb(255, 240, 245)", // Lavender Blush
  "rgb(250, 240, 230)", // Linen
  "rgb(255, 228, 181)", // Moccasin
  "rgb(255, 250, 250)", // Snow
  "rgb(240, 255, 255)", // Azure
  "rgb(240, 255, 240)", // Honeydew
  "rgb(245, 245, 245)", // White Smoke
  "rgb(245, 255, 250)", // Mint Cream
  "rgb(240, 248, 255)", // Alice Blue
  "rgb(240, 248, 255)", // Ghost White
  "rgb(248, 248, 255)", // Ghost White
  "rgb(255, 250, 240)", // Floral White
  "rgb(253, 245, 230)", // Old Lace
];

const backgroundColors = [
  "rgb(245, 245, 220)", // Soft Beige
  "rgb(176, 224, 230)", // Pale Blue
  "rgb(211, 211, 211)", // Light Grey
  "rgb(152, 251, 152)", // Pastel Green
  "rgb(255, 253, 208)", // Cream
  "rgb(230, 230, 250)", // Muted Lavender
  "rgb(188, 143, 143)", // Dusty Rose
  "rgb(135, 206, 235)", // Sky Blue
  "rgb(245, 255, 250)", // Mint Cream
  "rgb(245, 222, 179)", // Wheat
  "rgb(47, 79, 79)", // Dark Slate Gray
  "rgb(72, 61, 139)", // Dark Slate Blue
  "rgb(60, 20, 20)", // Dark Brown
  "rgb(25, 25, 112)", // Midnight Blue
  "rgb(139, 0, 0)", // Dark Red
  "rgb(85, 107, 47)", // Olive Drab
  "rgb(128, 0, 128)", // Purple
  "rgb(0, 100, 0)", // Dark Green
  "rgb(0, 0, 139)", // Dark Blue
  "rgb(105, 105, 105)", // Dim Gray
  "rgb(240, 128, 128)", // Light Coral
  "rgb(255, 160, 122)", // Light Salmon
  "rgb(255, 218, 185)", // Peach Puff
  "rgb(255, 228, 196)", // Bisque
  "rgb(255, 222, 173)", // Navajo White
  "rgb(255, 250, 205)", // Lemon Chiffon
  "rgb(250, 250, 210)", // Light Goldenrod Yellow
  "rgb(255, 239, 213)", // Papaya Whip
  "rgb(255, 245, 238)", // Sea Shell
  "rgb(255, 248, 220)", // Cornsilk
  "rgb(255, 255, 240)", // Ivory
  "rgb(240, 255, 240)", // Honeydew
  "rgb(240, 255, 255)", // Azure
  "rgb(240, 248, 255)", // Alice Blue
  "rgb(248, 248, 255)", // Ghost White
  "rgb(255, 250, 250)", // Snow
  "rgb(255, 240, 245)", // Lavender Blush
  "rgb(255, 228, 225)", // Misty Rose
  "rgb(230, 230, 250)", // Lavender
  "rgb(216, 191, 216)", // Thistle
  "rgb(221, 160, 221)", // Plum
  "rgb(238, 130, 238)", // Violet
  "rgb(218, 112, 214)", // Orchid
  "rgb(186, 85, 211)", // Medium Orchid
  "rgb(147, 112, 219)", // Medium Purple
  "rgb(138, 43, 226)", // Blue Violet
  "rgb(148, 0, 211)", // Dark Violet
  "rgb(153, 50, 204)", // Dark Orchid
  "rgb(139, 69, 19)", // Saddle Brown
  "rgb(160, 82, 45)", // Sienna
  "rgb(210, 105, 30)", // Chocolate
  "rgb(205, 133, 63)", // Peru
  "rgb(244, 164, 96)", // Sandy Brown
  "rgb(222, 184, 135)", // Burly Wood
  "rgb(255, 250, 240)", // Floral White
  "rgb(253, 245, 230)", // Old Lace
  "rgb(250, 240, 230)", // Linen
];

// Same logic as generateFace() in FaceGenerator.vue; returns the state object
// that the template reads from.
export function generateFace() {
  const s = {};
  s.faceScale = 1.5 + Math.random() * 0.6;
  s.haventSleptForDays = Math.random() > 0.8;
  const faceResults = faceShape.generateFaceCountourPoints();
  s.computedFacePoints = faceResults.face;
  s.faceHeight = faceResults.height;
  s.faceWidth = faceResults.width;
  s.center = faceResults.center;
  const eyes = eyeShape.generateBothEyes(s.faceWidth / 2);
  const left = eyes.left;
  const right = eyes.right;
  s.eyeRightUpper = right.upper;
  s.eyeRightLower = right.lower;
  s.eyeRightCountour = right.upper
    .slice(10, 90)
    .concat(right.lower.slice(10, 90).reverse());
  s.eyeLeftUpper = left.upper;
  s.eyeLeftLower = left.lower;
  s.eyeLeftCountour = left.upper
    .slice(10, 90)
    .concat(left.lower.slice(10, 90).reverse());
  s.distanceBetweenEyes = randomFromInterval(s.faceWidth / 4.5, s.faceWidth / 4);
  s.eyeHeightOffset = randomFromInterval(s.faceHeight / 8, s.faceHeight / 6);
  s.leftEyeOffsetX = randomFromInterval(-s.faceWidth / 20, s.faceWidth / 10);
  s.leftEyeOffsetY = randomFromInterval(-s.faceHeight / 50, s.faceHeight / 50);
  s.rightEyeOffsetX = randomFromInterval(-s.faceWidth / 20, s.faceWidth / 10);
  s.rightEyeOffsetY = randomFromInterval(-s.faceHeight / 50, s.faceHeight / 50);

  // pupil position: pick a point on each lid and interpolate between them
  const leftInd0 = Math.floor(randomFromInterval(10, left.upper.length - 10));
  const rightInd0 = Math.floor(randomFromInterval(10, right.upper.length - 10));
  const leftInd1 = Math.floor(randomFromInterval(10, left.upper.length - 10));
  const rightInd1 = Math.floor(randomFromInterval(10, right.upper.length - 10));
  const leftLerp = randomFromInterval(0.2, 0.8);
  const rightLerp = randomFromInterval(0.2, 0.8);
  s.leftPupilShiftY =
    left.upper[leftInd0][1] * leftLerp + left.lower[leftInd1][1] * (1 - leftLerp);
  s.rightPupilShiftY =
    right.upper[rightInd0][1] * rightLerp + right.lower[rightInd1][1] * (1 - rightLerp);
  s.leftPupilShiftX =
    left.upper[leftInd0][0] * leftLerp + left.lower[leftInd1][0] * (1 - leftLerp);
  s.rightPupilShiftX =
    right.upper[rightInd0][0] * rightLerp + right.lower[rightInd1][0] * (1 - rightLerp);

  const numHairLines = [];
  for (let i = 0; i < 4; i++) {
    numHairLines.push(Math.floor(randomFromInterval(0, 50)));
  }
  s.hairs = [];
  if (Math.random() > 0.3) {
    s.hairs = hairLines.generateHairLines0(s.computedFacePoints, numHairLines[0] * 1 + 10);
  }
  if (Math.random() > 0.3) {
    s.hairs = s.hairs.concat(
      hairLines.generateHairLines1(s.computedFacePoints, numHairLines[1] / 1.5 + 10),
    );
  }
  if (Math.random() > 0.5) {
    s.hairs = s.hairs.concat(
      hairLines.generateHairLines2(s.computedFacePoints, numHairLines[2] * 3 + 10),
    );
  }
  if (Math.random() > 0.5) {
    s.hairs = s.hairs.concat(
      hairLines.generateHairLines3(s.computedFacePoints, numHairLines[3] * 3 + 10),
    );
  }

  s.rightNoseCenterX = randomFromInterval(s.faceWidth / 18, s.faceWidth / 12);
  s.rightNoseCenterY = randomFromInterval(0, s.faceHeight / 5);
  s.leftNoseCenterX = randomFromInterval(-s.faceWidth / 18, -s.faceWidth / 12);
  s.leftNoseCenterY =
    s.rightNoseCenterY + randomFromInterval(-s.faceHeight / 30, s.faceHeight / 20);

  s.dyeColorOffset = "50%";
  if (Math.random() > 0.1) {
    // natural hair color
    s.hairColor = hairColors[Math.floor(Math.random() * 10)];
  } else {
    s.hairColor = "url(#rainbowGradient)";
    s.dyeColorOffset = randomFromInterval(0, 100) + "%";
  }

  const choice = Math.floor(Math.random() * 3);
  if (choice == 0) {
    s.mouthPoints = mouthShape.generateMouthShape0(s.computedFacePoints, s.faceHeight, s.faceWidth);
  } else if (choice == 1) {
    s.mouthPoints = mouthShape.generateMouthShape1(s.computedFacePoints, s.faceHeight, s.faceWidth);
  } else {
    s.mouthPoints = mouthShape.generateMouthShape2(s.computedFacePoints, s.faceHeight, s.faceWidth);
  }
  return s;
}

// Same markup as the <svg> in FaceGenerator.vue's template. Math.random() calls
// that the template evaluated on each render are evaluated here the same way.
// Point arrays are stringified like Vue does for attributes ("x,y,x,y,...").
export function renderFaceSVG(s) {
  const rnd = Math.random;
  const lidWidth = (s.haventSleptForDays ? 5.0 : 3.0) / s.faceScale;
  const rightEye =
    "translate(" +
    (s.center[0] + s.distanceBetweenEyes + s.rightEyeOffsetX) +
    " " +
    -(-s.center[1] + s.eyeHeightOffset + s.rightEyeOffsetY) +
    ")";
  const leftEye =
    "translate(" +
    -(s.center[0] + s.distanceBetweenEyes + s.leftEyeOffsetX) +
    " " +
    -(-s.center[1] + s.eyeHeightOffset + s.leftEyeOffsetY) +
    ")";

  const repeat = (n, fn) => Array.from({ length: n }, fn).join("");
  const pupils = (cx, cy, clip) =>
    repeat(
      10,
      () =>
        `<circle r="${rnd() * 2 + 3.0}" cx="${cx + rnd() * 5 - 2.5}" cy="${cy + rnd() * 5 - 2.5}" ` +
        `stroke="black" fill="none" stroke-width="${1.0 + rnd() * 0.5}" ` +
        `filter="url(#fuzzy)" clip-path="url(#${clip})"/>`,
    );
  const nostril = (cx, cy) =>
    repeat(
      10,
      () =>
        `<circle r="${rnd() * 2 + 1.0}" cx="${cx + rnd() * 4 - 2}" cy="${cy + rnd() * 4 - 2}" ` +
        `stroke="black" fill="none" stroke-width="${1.0 + rnd() * 0.5}" filter="url(#fuzzy)"/>`,
    );

  const nose =
    rnd() > 0.5
      ? `<g id="pointNose">` +
        `<g id="rightNose">${nostril(s.rightNoseCenterX, s.rightNoseCenterY)}</g>` +
        `<g id="leftNose">${nostril(s.leftNoseCenterX, s.leftNoseCenterY)}</g>` +
        `</g>`
      : `<g id="lineNose"><path d="${
          "M " + s.leftNoseCenterX + " " + s.leftNoseCenterY +
          ", Q" + s.rightNoseCenterX + " " + s.rightNoseCenterY * 1.5 +
          "," + (s.leftNoseCenterX + s.rightNoseCenterX) / 2 + " " + -s.eyeHeightOffset * 0.2
        }" fill="none" stroke="black" stroke-width="${2.5 + rnd() * 1.0}" ` +
        `stroke-linejoin="round" filter="url(#fuzzy)"></path></g>`;

  const hairs = s.hairs
    .map(
      (hair) =>
        `<polyline points="${String(hair)}" fill="none" stroke="${s.hairColor}" ` +
        `stroke-width="${0.5 + rnd() * 2.5}" stroke-linejoin="round" filter="url(#fuzzy)"/>`,
    )
    .join("");

  return (
    `<svg viewBox="-100 -100 200 200" xmlns="http://www.w3.org/2000/svg" ` +
    `width="${SVG_SIZE}" height="${SVG_SIZE}" id="face-svg">` +
    `<defs>` +
    `<clipPath id="leftEyeClipPath"><polyline points="${String(s.eyeLeftCountour)}"/></clipPath>` +
    `<clipPath id="rightEyeClipPath"><polyline points="${String(s.eyeRightCountour)}"/></clipPath>` +
    `<filter id="fuzzy">` +
    `<feTurbulence id="turbulence" baseFrequency="0.05" numOctaves="3" type="turbulence" result="noise"/>` +
    `<feDisplacementMap in="SourceGraphic" in2="noise" scale="2"/>` +
    `</filter>` +
    `<linearGradient id="rainbowGradient" x1="0%" y1="0%" x2="100%" y2="0%">` +
    `<stop offset="0%" style="stop-color: ${hairColors[Math.floor(rnd() * 10)]};  stop-opacity: 1"/>` +
    `<stop offset="${s.dyeColorOffset}" style="stop-color: ${hairColors[Math.floor(rnd() * hairColors.length)]};  stop-opacity: 1"/>` +
    `<stop offset="100%" style="stop-color: ${hairColors[Math.floor(rnd() * hairColors.length)]};  stop-opacity: 1"/>` +
    `</linearGradient>` +
    `</defs>` +
    `<title>That's an ugly face</title>` +
    `<desc>CREATED BY XUAN TANG, MORE INFO AT TXSTC55.GITHUB.IO</desc>` +
    `<rect x="-100" y="-100" width="100%" height="100%" ` +
    `fill="${backgroundColors[Math.floor(rnd() * backgroundColors.length)]}"/>` +
    `<polyline id="faceContour" points="${String(s.computedFacePoints)}" fill="#ffc9a9" ` +
    `stroke="black" stroke-width="${3.0 / s.faceScale}" stroke-linejoin="round" filter="url(#fuzzy)"/>` +
    `<g transform="${rightEye}">` +
    `<polyline id="rightCountour" points="${String(s.eyeRightCountour)}" fill="white" stroke="white" ` +
    `stroke-width="${0.0 / s.faceScale}" stroke-linejoin="round" filter="url(#fuzzy)"/>` +
    `</g>` +
    `<g transform="${leftEye}">` +
    `<polyline id="leftCountour" points="${String(s.eyeLeftCountour)}" fill="white" stroke="white" ` +
    `stroke-width="${0.0 / s.faceScale}" stroke-linejoin="round" filter="url(#fuzzy)"/>` +
    `</g>` +
    `<g transform="${rightEye}">` +
    `<polyline id="rightUpper" points="${String(s.eyeRightUpper)}" fill="none" stroke="black" ` +
    `stroke-width="${lidWidth}" stroke-linejoin="round" stroke-linecap="round" filter="url(#fuzzy)"/>` +
    `<polyline id="rightLower" points="${String(s.eyeRightLower)}" fill="none" stroke="black" ` +
    `stroke-width="${lidWidth}" stroke-linejoin="round" stroke-linecap="round" filter="url(#fuzzy)"/>` +
    pupils(s.rightPupilShiftX, s.rightPupilShiftY, "rightEyeClipPath") +
    `</g>` +
    `<g transform="${leftEye}">` +
    `<polyline id="leftUpper" points="${String(s.eyeLeftUpper)}" fill="none" stroke="black" ` +
    `stroke-width="${lidWidth}" stroke-linejoin="round" filter="url(#fuzzy)"/>` +
    `<polyline id="leftLower" points="${String(s.eyeLeftLower)}" fill="none" stroke="black" ` +
    `stroke-width="${lidWidth}" stroke-linejoin="round" filter="url(#fuzzy)"/>` +
    pupils(s.leftPupilShiftX, s.leftPupilShiftY, "leftEyeClipPath") +
    `</g>` +
    `<g id="hairs">${hairs}</g>` +
    nose +
    `<g id="mouth"><polyline points="${String(s.mouthPoints)}" fill="rgb(215,127,140)" ` +
    `stroke="black" stroke-width="${2.7 + rnd() * 0.5}" stroke-linejoin="round" filter="url(#fuzzy)"/></g>` +
    `</svg>`
  );
}

// Same as downloadSVGAsPNG() in FaceGenerator.vue, but the canvas is always
// SVG_SIZE x SVG_SIZE so the PNG is never cropped on small screens.
export function downloadSVGAsPNG(svg) {
  const svgData = new XMLSerializer().serializeToString(svg);
  const canvas = document.createElement("canvas");
  canvas.width = SVG_SIZE;
  canvas.height = SVG_SIZE;
  const ctx = canvas.getContext("2d");
  const img = new Image();
  img.onload = () => {
    ctx.drawImage(img, 0, 0, SVG_SIZE, SVG_SIZE);
    const a = document.createElement("a");
    a.download = "face.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
  };
  img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgData);
}

// Wire up the page: draw a face, the two buttons, and the keyboard shortcuts
// (space = another face, "s" = download), as in the original.
export function mount({ holder, anotherButton, downloadButton }) {
  const draw = () => {
    holder.innerHTML = renderFaceSVG(generateFace());
  };
  const download = () => downloadSVGAsPNG(holder.querySelector("svg"));
  anotherButton.addEventListener("click", draw);
  downloadButton.addEventListener("click", download);
  window.addEventListener("keydown", (e) => {
    if (e.key === " ") {
      e.preventDefault();
      draw();
    } else if (e.key === "s") {
      download();
    }
  });
  draw();
}
