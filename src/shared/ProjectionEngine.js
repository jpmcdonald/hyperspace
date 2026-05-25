// Generalized n-D rotation and projection.
//
// Rotation in n dimensions happens in planes, not around axes.
// 2D has 1 rotation plane (xy)
// 3D has 3 rotation planes (xy, xz, yz)
// 4D has 6 rotation planes (xy, xz, yz, xw, yw, zw)
// 5D has 10 rotation planes
// 6D has 15 rotation planes
// In general: C(n, 2) = n(n-1)/2 planes.

/**
 * Generate all rotation plane pairs for n-dimensional space.
 * Returns labels like 'xy', 'xz', 'xw', 'xv', 'xu', ... up to 6D.
 * For 7D+, switches to numeric labels '01', '02', ...
 */
export function rotationPlanes(n) {
  const labels = ['x', 'y', 'z', 'w', 'v', 'u'];
  const planes = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const li = i < labels.length ? labels[i] : String(i);
      const lj = j < labels.length ? labels[j] : String(j);
      planes.push({ i, j, label: li + lj });
    }
  }
  return planes;
}

/**
 * Rotate an n-dimensional point through one plane (i, j) by angle theta.
 * Mutates and returns p.
 */
export function rotateInPlane(p, i, j, theta) {
  const c = Math.cos(theta);
  const s = Math.sin(theta);
  const a = p[i] * c - p[j] * s;
  const b = p[i] * s + p[j] * c;
  p[i] = a;
  p[j] = b;
  return p;
}

/**
 * Apply all rotations to a single n-D point.
 * `angles` is an object keyed by plane label ('xy', 'xw', etc).
 * `planes` is the result of rotationPlanes(n).
 * Returns a new array — does not mutate input.
 */
export function rotateND(point, angles, planes) {
  const p = [...point];
  for (const plane of planes) {
    const theta = angles[plane.label] || 0;
    if (theta !== 0) rotateInPlane(p, plane.i, plane.j, theta);
  }
  return p;
}

/**
 * Perspective project an n-D point down to 2D.
 *
 * Strategy: collapse from n down to 3 by successive perspective projections
 * along the highest-index axis each time. Then project 3 → 2.
 *
 * For each higher-dim axis: factor = dist / (dist - axisValue)
 * For final 3→2: factor = zDist / (zDist - z3)
 *
 * Returns { x, y, w_factor, last_w } where w_factor is the cumulative
 * higher-dimensional perspective factor (useful for coloring vertices
 * by their "depth" in the higher dimensions).
 */
export function projectND(point, opts = {}) {
  const dists = opts.dists || []; // dists[k] is the perspective distance for collapsing axis (k+3)
  const zDist = opts.zDist || 4;
  const defaultDist = opts.defaultDist || 3;

  const p = [...point];
  let wFactor = 1;
  let lastHigherDimValue = p.length > 3 ? p[p.length - 1] : 0;

  // Collapse axes 3, 4, 5, ... down to 3D one at a time, from highest index down.
  for (let dim = p.length - 1; dim >= 3; dim--) {
    const d = dists[dim - 3] !== undefined ? dists[dim - 3] : defaultDist;
    const axisVal = p[dim];
    const f = d / (d - axisVal);
    wFactor *= f;
    for (let k = 0; k < dim; k++) p[k] *= f;
  }

  // Now p[0], p[1], p[2] are 3D coords. Project to 2D with perspective along z.
  const z = p.length >= 3 ? p[2] : 0;
  const zf = zDist / (zDist - z);
  const x2 = p[0] * zf;
  const y2 = p[1] * zf;

  return {
    x: x2,
    y: y2,
    wFactor,
    lastHigherDimValue,
    z3: z,
  };
}

/**
 * Convenience: project a list of vertices and return canvas-space points.
 */
export function projectVertices(vertices, angles, planes, opts = {}) {
  const scale = opts.scale || 100;
  const cx = opts.cx || 0;
  const cy = opts.cy || 0;
  return vertices.map(v => {
    const rotated = rotateND(v, angles, planes);
    const projected = projectND(rotated, opts);
    return {
      x: cx + projected.x * scale,
      y: cy + projected.y * scale,
      wFactor: projected.wFactor,
      lastHigherDimValue: projected.lastHigherDimValue,
      rotated,
    };
  });
}
