(function homeCanvas() {
  const canvas = document.getElementById("home-canvas");

  if (!canvas) {
    return;
  }

  const context = canvas.getContext("2d");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const devicePixelRatioValue = Math.min(window.devicePixelRatio || 1, 2);
  const repeatText = "Faye Zhou + ";
  const phrase = ["Hi", "i", "am", "Faye", "Zhou"];
  const ropes = [];
  const pointer = {
    x: window.innerWidth * 0.5,
    y: window.innerHeight * 0.45,
    radius: 120,
    active: false
  };

  function createRope(letter, anchorX, anchorY, bottomY, index, cluster) {
    const points = [];
    const segments = 18;
    const targetX = anchorX;
    const targetY = bottomY;

    for (let step = 0; step <= segments; step += 1) {
      const t = step / segments;
      const x = anchorX + Math.sin(t * Math.PI) * cluster.curve * (0.6 + t * 0.7);
      const y = anchorY + (targetY - anchorY) * t;
      points.push({
        x,
        y,
        previousX: x,
        previousY: y,
        pinned: step === 0
      });
    }

    return {
      letter,
      points,
      restLength: (targetY - anchorY) / segments,
      anchorX,
      anchorY,
      targetX,
      targetY,
      clusterIndex: cluster.index,
      letterIndex: index,
      textOffset: cluster.textOffset
    };
  }

  function layoutRopes() {
    ropes.length = 0;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const isCompact = width < 720;
    const topMargin = isCompact ? 54 : 30;
    const usableWidth = Math.min(width * (isCompact ? 0.92 : 0.88), isCompact ? 360 : 1180);
    const startX = (width - usableWidth) / 2 + usableWidth * (isCompact ? 0.02 : 0.08);
    const spacing = usableWidth / (isCompact ? 10.8 : 12.4);
    const bottomBase = isCompact
      ? Math.min(height * 0.74, height - 138)
      : Math.min(height * 0.62, height - 230);
    const letterDropStep = isCompact ? 5 : 8;
    let globalIndex = 0;

    const clusters = isCompact
      ? [
          { index: 0, anchorShift: 0.05, letterStep: 0.72, curve: -4, textOffset: 0, bottomShift: 30 },
          { index: 1, anchorShift: 1.3, letterStep: 0.68, curve: 3, textOffset: 3, bottomShift: 12 },
          { index: 2, anchorShift: 2.55, letterStep: 0.7, curve: -5, textOffset: 6, bottomShift: 26 },
          { index: 3, anchorShift: 4.45, letterStep: 0.7, curve: 8, textOffset: 2, bottomShift: 2 },
          { index: 4, anchorShift: 8.7, letterStep: 0.72, curve: -7, textOffset: 7, bottomShift: 58 }
        ]
      : [
          { index: 0, anchorShift: -0.4, curve: -8, textOffset: 0, bottomShift: 46 },
          { index: 1, anchorShift: 0.2, curve: 4, textOffset: 3, bottomShift: -4 },
          { index: 2, anchorShift: 1.5, curve: -10, textOffset: 6, bottomShift: 24 },
          { index: 3, anchorShift: 3.9, curve: 14, textOffset: 2, bottomShift: 12 },
          { index: 4, anchorShift: 7.0, curve: -11, textOffset: 7, bottomShift: 54 }
        ];

    phrase.forEach((word, clusterIndex) => {
      const cluster = clusters[clusterIndex];
      const letters = Array.from(word);

      letters.forEach((letter, letterIndex) => {
        const letterStep = cluster.letterStep || 0.92;
        const anchorX = startX + (cluster.anchorShift + letterIndex * letterStep) * spacing;
        const anchorY = topMargin;
        const bottomY = bottomBase + cluster.bottomShift + letterIndex * letterDropStep;
        ropes.push(createRope(letter, anchorX, anchorY, bottomY, globalIndex, cluster));
        globalIndex += 1;
      });
    });
  }

  function resize() {
    const width = window.innerWidth;
    const isCompact = width < 720;
    const height = Math.max(window.innerHeight - (isCompact ? 176 : 140), isCompact ? 520 : 560);

    canvas.width = Math.round(width * devicePixelRatioValue);
    canvas.height = Math.round(height * devicePixelRatioValue);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    context.setTransform(devicePixelRatioValue, 0, 0, devicePixelRatioValue, 0, 0);
    pointer.radius = isCompact ? 92 : 120;
    layoutRopes();
  }

  function applyPhysics(rope) {
    for (let index = 1; index < rope.points.length; index += 1) {
      const point = rope.points[index];
      const velocityX = (point.x - point.previousX) * 0.985;
      const velocityY = (point.y - point.previousY) * 0.985;

      point.previousX = point.x;
      point.previousY = point.y;

      point.x += velocityX;
      point.y += velocityY + 0.18;

      const distanceToPointer = Math.hypot(point.x - pointer.x, point.y - pointer.y);

      if (distanceToPointer < pointer.radius) {
        const force = (1 - distanceToPointer / pointer.radius) * 8.5;
        const angle = Math.atan2(point.y - pointer.y, point.x - pointer.x);
        point.x += Math.cos(angle) * force;
        point.y += Math.sin(angle) * force;
      }
    }

    const lastPoint = rope.points[rope.points.length - 1];
    lastPoint.x += (rope.targetX - lastPoint.x) * 0.018;
    lastPoint.y += (rope.targetY - lastPoint.y) * 0.018;
  }

  function enforceConstraints(rope) {
    for (let iteration = 0; iteration < 6; iteration += 1) {
      rope.points[0].x = rope.anchorX;
      rope.points[0].y = rope.anchorY;

      for (let index = 0; index < rope.points.length - 1; index += 1) {
        const point = rope.points[index];
        const nextPoint = rope.points[index + 1];
        const dx = nextPoint.x - point.x;
        const dy = nextPoint.y - point.y;
        const distance = Math.hypot(dx, dy) || 0.0001;
        const difference = (distance - rope.restLength) / distance;
        const offsetX = dx * 0.5 * difference;
        const offsetY = dy * 0.5 * difference;

        if (!point.pinned) {
          point.x += offsetX;
          point.y += offsetY;
        }

        nextPoint.x -= offsetX;
        nextPoint.y -= offsetY;
      }
    }
  }

  function drawRepeatedText(rope) {
    context.save();
    context.font = window.innerWidth < 720 ? "9px IBM Plex Sans" : "10px IBM Plex Sans";
    context.fillStyle = "rgba(16, 16, 16, 0.14)";
    context.textAlign = "center";
    context.textBaseline = "middle";

    let textIndex = rope.textOffset;

    for (let index = 0; index < rope.points.length - 1; index += 1) {
      const point = rope.points[index];
      const nextPoint = rope.points[index + 1];
      const dx = nextPoint.x - point.x;
      const dy = nextPoint.y - point.y;
      const distance = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx);
      const steps = Math.max(1, Math.floor(distance / 13));

      for (let step = 0; step < steps; step += 1) {
        const t = steps === 1 ? 0.5 : step / steps;
        const x = point.x + dx * t;
        const y = point.y + dy * t;

        context.save();
        context.translate(x, y);
        context.rotate(angle);
        context.fillText(repeatText[textIndex % repeatText.length], 0, 0);
        context.restore();

        textIndex += 1;
      }
    }

    context.restore();
  }

  function drawLetter(rope) {
    const lastPoint = rope.points[rope.points.length - 1];
    const previousPoint = rope.points[rope.points.length - 2];
    const angle = Math.atan2(lastPoint.y - previousPoint.y, lastPoint.x - previousPoint.x);
    const horizontalVelocity = lastPoint.x - lastPoint.previousX;
    const letterSize = window.innerWidth < 720 ? 40 : 56;

    context.save();
    context.translate(lastPoint.x, lastPoint.y + 22);
    context.rotate(angle * 0.3 + horizontalVelocity * 0.02);
    context.fillStyle = "#050505";
    context.font = `700 ${letterSize}px 'Shantell Sans'`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(rope.letter, 0, 0);
    context.restore();
  }

  function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    ropes.forEach((rope) => {
      applyPhysics(rope);
    });

    ropes.forEach((rope) => {
      enforceConstraints(rope);
    });

    ropes.forEach((rope) => {
      drawRepeatedText(rope);
    });

    ropes.forEach((rope) => {
      drawLetter(rope);
    });
  }

  function loop() {
    draw();

    if (!prefersReducedMotion || pointer.active) {
      window.requestAnimationFrame(loop);
    }
  }

  function setPointer(event) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
    pointer.active = true;

    if (prefersReducedMotion) {
      window.requestAnimationFrame(loop);
    }
  }

  canvas.addEventListener("pointermove", setPointer, { passive: true });
  canvas.addEventListener("pointerdown", setPointer, { passive: true });
  canvas.addEventListener("pointerleave", () => {
    pointer.active = false;
    pointer.x = window.innerWidth * 0.5;
    pointer.y = window.innerHeight * 0.45;
    if (prefersReducedMotion) {
      window.requestAnimationFrame(loop);
    }
  }, { passive: true });

  window.addEventListener("resize", () => {
    resize();
    if (prefersReducedMotion) {
      draw();
    }
  });

  resize();
  loop();
})();
