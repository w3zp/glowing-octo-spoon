const { Engine, Render, Runner, Bodies, World, Body, Events } = Matter;

const width = 800;
const height = 400;

const engine = Engine.create();
const world = engine.world;

const render = Render.create({
  element: document.body,
  canvas: document.getElementById('gameCanvas'),
  engine: engine,
  options: {
    width,
    height,
    wireframes: false,
    background: '#fff'
  }
});
Render.run(render);
const runner = Runner.create();
Runner.run(runner, engine);

// ground
const ground = Bodies.rectangle(width / 2, height - 20, width, 40, {
  isStatic: true,
  render: { fillStyle: '#060' }
});
// player
const player = Bodies.rectangle(100, height - 60, 40, 40, {
  restitution: 0,
  render: { fillStyle: '#0084d1' }
});
// obstacle
const obstacle = Bodies.rectangle(width + 50, height - 60, 40, 40, {
  isStatic: true,
  render: { fillStyle: 'red' }
});

World.add(world, [ground, player, obstacle]);

// jump on space or up arrow
function handleKey(event) {
  if (event.code === 'Space' || event.code === 'ArrowUp') {
    const onGround = player.position.y >= height - 60;
    if (onGround) {
      Body.setVelocity(player, { x: player.velocity.x, y: -12 });
    }
  }
}
document.addEventListener('keydown', handleKey);

Events.on(engine, 'beforeUpdate', () => {
  // move obstacle left
  Body.translate(obstacle, { x: -5, y: 0 });
  if (obstacle.position.x < -50) {
    Body.setPosition(obstacle, { x: width + 50, y: height - 60 });
  }

  // if player falls
  if (player.position.y > height + 50) {
    resetGame();
  }
});

Events.on(engine, 'collisionStart', (event) => {
  for (const pair of event.pairs) {
    if ((pair.bodyA === player && pair.bodyB === obstacle) ||
        (pair.bodyA === obstacle && pair.bodyB === player)) {
      resetGame();
      break;
    }
  }
});

function resetGame() {
  alert('Game Over!');
  Body.setPosition(player, { x: 100, y: height - 60 });
  Body.setVelocity(player, { x: 0, y: 0 });
  Body.setPosition(obstacle, { x: width + 50, y: height - 60 });
}
