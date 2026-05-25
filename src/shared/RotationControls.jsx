import React from 'react';

/**
 * Renders a slider + spin checkbox for each rotation plane.
 * Generic across any number of dimensions.
 *
 * Props:
 *   planes: [{ label, i, j }, ...]   from rotationPlanes(n)
 *   angles: { 'xy': 0.0, 'xw': 0.5, ... }
 *   spin: { 'xy': false, 'xw': true, ... }
 *   onAngleChange(label, value)
 *   onSpinChange(label, checked)
 *   threeDimensionalCount: how many dimensions count as "normal 3D" for color coding
 *     (default 3 — so planes touching axes 0,1,2 are blue, anything involving axis 3+ is gold)
 */
export default function RotationControls({
  planes,
  angles,
  spin,
  onAngleChange,
  onSpinChange,
  threeDimensionalCount = 3,
}) {
  return (
    <div>
      {planes.map(plane => {
        const involvesHigherDim = plane.j >= threeDimensionalCount;
        const color = involvesHigherDim ? 'var(--accent-4d)' : 'var(--accent-3d)';
        const desc = involvesHigherDim ? 'rotates through higher dim' : 'normal 3D spin';
        return (
          <div key={plane.label} style={{ marginBottom: 14 }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 4,
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={spin[plane.label] || false}
                  onChange={(e) => onSpinChange(plane.label, e.target.checked)}
                  style={{ accentColor: 'var(--accent-4d)' }}
                />
                <span style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 15,
                  fontStyle: 'italic',
                  color,
                }}>
                  {plane.label.toUpperCase()}
                </span>
                <span style={{ fontSize: 10, color: 'var(--text-faint)' }}>
                  {desc}
                </span>
              </label>
              <span style={{ fontSize: 10, color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>
                {((angles[plane.label] || 0)).toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min={-Math.PI}
              max={Math.PI}
              step={0.01}
              value={normalizeAngle(angles[plane.label] || 0)}
              onChange={(e) => onAngleChange(plane.label, parseFloat(e.target.value))}
              style={{ accentColor: color }}
            />
          </div>
        );
      })}
    </div>
  );
}

function normalizeAngle(a) {
  const TWO_PI = Math.PI * 2;
  return ((a + Math.PI) % TWO_PI + TWO_PI) % TWO_PI - Math.PI;
}
