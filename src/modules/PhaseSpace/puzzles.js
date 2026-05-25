export const phaseSpacePuzzles = [
  {
    id: 'dimension',
    prompt: 'How many numbers fully describe the pendulum\'s state at one instant?',
    options: [1, 2, 3, 4],
    answer: 2,
    reveal: 'Two: angle θ and angular velocity ω. Together they are one point in phase space.',
  },
  {
    id: 'undamped_shape',
    prompt: 'With no damping and small angles (linearized), what shape is the orbit in (θ, ω) space?',
    options: ['circle', 'ellipse', 'parabola', 'hyperbola'],
    answer: 'ellipse',
    reveal: 'An ellipse. Energy is conserved, so the orbit follows a closed curve — an ellipse for the linear harmonic oscillator.',
  },
  {
    id: 'damping',
    prompt: 'What happens to the orbit when damping b > 0?',
    options: ['ellipse', 'spiral to origin', 'straight line', 'chaos'],
    answer: 'spiral to origin',
    reveal: 'The trajectory spirals inward toward (0, 0). Damping drains energy; the state point loses speed and returns to rest.',
  },
  {
    id: 'phase_vs_room',
    prompt: 'Where does the pendulum\'s "state" live?',
    options: ['the room', '(θ, ω) plane', 'a circle', 'time axis'],
    answer: '(θ, ω) plane',
    reveal: 'In the (θ, ω) plane — phase space. The bob moves in the room; the state moves on a curve in this abstract 2D space.',
  },
  {
    id: 'nonlinear',
    prompt: 'Large-angle (nonlinear) vs small-angle (linearized): long-term path?',
    options: ['identical', 'different period/path', 'no motion', 'random'],
    answer: 'different period/path',
    reveal: 'Different. sin θ ≠ θ at large angles, so the period and orbit shape diverge from the AP small-angle approximation.',
  },
  {
    id: 'energy_damped',
    prompt: 'When b > 0, what happens to total mechanical energy over time?',
    options: ['increases', 'stays constant', 'decreases', 'oscillates'],
    answer: 'decreases',
    reveal: 'Energy decreases. Damping does negative work; the spiral in phase space is the geometric picture of losing energy.',
  },
];
