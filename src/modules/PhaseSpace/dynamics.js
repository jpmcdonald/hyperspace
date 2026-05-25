// Simple pendulum dynamics: state (theta, omega), params (g, L, b, linearized).

export const DEFAULT_PARAMS = {
  g: 9.8,
  L: 1.0,
  b: 0,
  linearized: false,
};

export const DEFAULT_STATE = {
  theta: Math.PI / 4,
  omega: 0,
};

export const INTEGRATION_DT = 0.02;

export function deriv(state, params) {
  const { theta, omega } = state;
  const { g, L, b, linearized } = params;
  const accel = linearized
    ? -(g / L) * theta
    : -(g / L) * Math.sin(theta);
  return { theta: omega, omega: accel - b * omega };
}

function addState(a, b, scale = 1) {
  return {
    theta: a.theta + scale * b.theta,
    omega: a.omega + scale * b.omega,
  };
}

export function stepRK4(state, dt, params) {
  const k1 = deriv(state, params);
  const k2 = deriv(addState(state, k1, dt / 2), params);
  const k3 = deriv(addState(state, k2, dt / 2), params);
  const k4 = deriv(addState(state, k3, dt), params);
  return addState(
    state,
    {
      theta: (k1.theta + 2 * k2.theta + 2 * k3.theta + k4.theta) / 6,
      omega: (k1.omega + 2 * k2.omega + 2 * k3.omega + k4.omega) / 6,
    },
    dt,
  );
}

export function energy(state, params) {
  const { theta, omega } = state;
  const { g, L } = params;
  const m = 1;
  return 0.5 * m * L * L * omega * omega + m * g * L * (1 - Math.cos(theta));
}
