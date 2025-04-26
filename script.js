import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

class GameRenderer {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.score = 0;
        this.gameOver = false;
        this.cameraOffset = new THREE.Vector3(10, 10, 10);
        this.controls = null; // OrbitControls instance
        this.gameOverText = null; // Element to display "Game Over" text
        this.controlsInfoWindow = null; // Element to display controls information

        this.initializeScene();
        this.createUI();
    }

    initializeScene() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true; // Enable shadows
        document.body.appendChild(this.renderer.domElement);

        // Set up camera position
        this.camera.position.set(30, 30, 30); // Set an initial position for better visibility
        this.camera.lookAt(10, 10, 10); // Center the camera on the middle of the arena

        // Add an ambient light for minimum lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        // Add a point light for dynamic lighting
        const pointLight = new THREE.PointLight(0xffffff, 15, 50);
        pointLight.position.set(10, 15, 10); // Position above the center of the arena
        pointLight.castShadow = true;
        this.scene.add(pointLight);

        // Add a spotlight for focused lighting
        const spotLight = new THREE.SpotLight(0xffa500, 30);
        spotLight.position.set(15, 25, 15); // Position above and to the side
        spotLight.angle = Math.PI / 6; // Narrow beam
        spotLight.penumbra = 0.3; // Soft edges
        spotLight.castShadow = true;
        this.scene.add(spotLight);

        // Add a ground plane to receive shadows
        const planeGeometry = new THREE.PlaneGeometry(20, 20);
        const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x008800 }); // Green color
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -Math.PI / 2;
        plane.position.set(10, 0, 10);
        plane.receiveShadow = true;
        this.scene.add(plane);

        // Add border lines for the y,z, x,y, x,z, and z=20 planes
        const borderMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
        const greenBorderMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 }); // Green color for the border

        // y,z plane border
        const yzBorderGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 20, 0),
            new THREE.Vector3(0, 20, 20),
            new THREE.Vector3(0, 0, 20),
            new THREE.Vector3(0, 0, 0)
        ]);
        const yzBorder = new THREE.Line(yzBorderGeometry, borderMaterial);
        this.scene.add(yzBorder);

        // x,y plane border
        const xyBorderGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(20, 0, 0),
            new THREE.Vector3(20, 20, 0),
            new THREE.Vector3(0, 20, 0),
            new THREE.Vector3(0, 0, 0)
        ]);
        const xyBorder = new THREE.Line(xyBorderGeometry, borderMaterial);
        this.scene.add(xyBorder);

        // x,z plane border
        const xzBorderGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(20, 0, 0),
            new THREE.Vector3(20, 0, 20),
            new THREE.Vector3(0, 0, 20),
            new THREE.Vector3(0, 0, 0)
        ]);
        const xzBorder = new THREE.Line(xzBorderGeometry, borderMaterial);
        this.scene.add(xzBorder);

        // y,x plane border
        const yxBorderGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(20, 0, 0),
            new THREE.Vector3(20, 20, 0),
            new THREE.Vector3(20, 20, 20),
            new THREE.Vector3(20, 0, 20),
            new THREE.Vector3(20, 0, 0)
        ]);
        const yxBorder = new THREE.Line(yxBorderGeometry, borderMaterial);
        this.scene.add(yxBorder);

        // z=20 plane border
        const z20BorderGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 20),
            new THREE.Vector3(20, 0, 20),
            new THREE.Vector3(20, 20, 20),
            new THREE.Vector3(0, 20, 20),
            new THREE.Vector3(0, 0, 20)
        ]);
        const z20Border = new THREE.Line(z20BorderGeometry, greenBorderMaterial);
        this.scene.add(z20Border);

        // Initialize OrbitControls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.set(10, 10, 10); // Set the target to the center of the arena
        this.controls.enableDamping = true; // Smooth camera movement
        this.controls.dampingFactor = 0.05;
        this.controls.update(); // Ensure the controls are updated with the new target
    }

    renderScene() {
        // Update OrbitControls
        if (this.controls) {
            this.controls.update();
        }
        this.renderer.render(this.scene, this.camera);
    }

    createUI() {
        // Create a UI container
        this.uiContainer = document.createElement('div');
        this.uiContainer.style.position = 'absolute';
        this.uiContainer.style.top = '10px';
        this.uiContainer.style.left = '10px';
        this.uiContainer.style.color = 'white';
        this.uiContainer.style.fontFamily = 'Arial, sans-serif';
        this.uiContainer.style.fontSize = '16px';
        document.body.appendChild(this.uiContainer);

        // Add score, length, and position elements
        this.scoreElement = document.createElement('div');
        this.lengthElement = document.createElement('div');
        this.positionElement = document.createElement('div');
        this.uiContainer.appendChild(this.scoreElement);
        this.uiContainer.appendChild(this.lengthElement);
        this.uiContainer.appendChild(this.positionElement);

        this.updateUI(0, 3, new THREE.Vector3(0, 0, 0));

        // Add "Game Over" text element
        this.gameOverText = document.createElement('div');
        this.gameOverText.style.position = 'absolute';
        this.gameOverText.style.top = '50%';
        this.gameOverText.style.left = '50%';
        this.gameOverText.style.transform = 'translate(-50%, -50%)';
        this.gameOverText.style.color = 'red';
        this.gameOverText.style.fontFamily = 'Arial, sans-serif';
        this.gameOverText.style.fontSize = '48px';
        this.gameOverText.style.fontWeight = 'bold';
        this.gameOverText.style.display = 'none'; // Initially hidden
        this.gameOverText.textContent = 'Game Over';
        document.body.appendChild(this.gameOverText);

        // Add controls information window
        this.controlsInfoWindow = document.createElement('div');
        this.controlsInfoWindow.style.position = 'absolute';
        this.controlsInfoWindow.style.top = '20%';
        this.controlsInfoWindow.style.left = '50%';
        this.controlsInfoWindow.style.transform = 'translate(-50%, -50%)';
        this.controlsInfoWindow.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        this.controlsInfoWindow.style.color = 'white';
        this.controlsInfoWindow.style.padding = '20px';
        this.controlsInfoWindow.style.borderRadius = '10px';
        this.controlsInfoWindow.style.fontFamily = 'Arial, sans-serif';
        this.controlsInfoWindow.style.fontSize = '16px';
        this.controlsInfoWindow.style.display = 'none'; // Initially hidden
        this.controlsInfoWindow.innerHTML = `
            <h2>Controls</h2>
            <p><strong>Q:</strong> Move down</p>
            <p><strong>E:</strong> Move up</p>
            <p><strong>W:</strong> Move forward (relative to the green side)</p>
            <p><strong>A:</strong> Move left (relative to the green side)</p>
            <p><strong>S:</strong> Move backward (relative to the green side)</p>
            <p><strong>D:</strong> Move right (relative to the green side)</p>
            <p><strong>Space:</strong> Hold to triple the snake's speed</p>
            <p><strong>R:</strong> Reset the game</p>
            <p><strong>I:</strong> Toggle this controls window</p>
        `;
        document.body.appendChild(this.controlsInfoWindow);

        // Add "Press I for Controls" information
        const controlsHint = document.createElement('div');
        controlsHint.style.marginTop = '10px';
        controlsHint.style.color = 'white';
        controlsHint.style.fontFamily = 'Arial, sans-serif';
        controlsHint.style.fontSize = '14px';
        controlsHint.textContent = 'Press i for Controls Information';
        this.uiContainer.appendChild(controlsHint);
    }

    toggleControlsInfo() {
        if (this.controlsInfoWindow) {
            this.controlsInfoWindow.style.display =
                this.controlsInfoWindow.style.display === 'none' ? 'block' : 'none';
        }
    }

    updateUI(score, length, position) {
        this.scoreElement.textContent = `Score: ${score}`;
        this.lengthElement.textContent = `Length: ${length}`;
        this.positionElement.textContent = `Position: (${position.x.toFixed(2)}, ${position.y.toFixed(2)}, ${position.z.toFixed(2)})`;
    }

    updateScore(newScore) {
        this.score = newScore;
        console.log(`Score: ${this.score}`);
    }

    showGameOver() {
        this.gameOver = true;
        console.log("Game Over!");

        // Display "Game Over" text
        if (this.gameOverText) {
            this.gameOverText.style.display = 'block';
        }

        // Ensure OrbitControls remains active for camera rotation
        if (this.controls) {
            this.controls.enabled = true;
        }
    }

    resetGame() {
        this.score = 0;
        this.gameOver = false;
        console.log("Game Reset!");

        // Hide "Game Over" text
        if (this.gameOverText) {
            this.gameOverText.style.display = 'none';
        }
    }
}

class FoodEntity {
    constructor(scene, bounds) {
        this.scene = scene;
        this.bounds = bounds;
        this.mesh = null;

        this.generateNewPosition();
    }

    generateNewPosition() {
        if (this.mesh) {
            this.scene.remove(this.mesh);
        }

        const geometry = new THREE.BoxGeometry(1, 1, 1); // Use a cube for food
        const material = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // Red color
        this.mesh = new THREE.Mesh(geometry, material);

        // Generate random position within bounds
        const x = Math.round(THREE.MathUtils.randFloat(this.bounds.min.x+1, this.bounds.max.x-1));
        const y = Math.round(THREE.MathUtils.randFloat(this.bounds.min.y+1, this.bounds.max.y-1));
        const z = Math.round(THREE.MathUtils.randFloat(this.bounds.min.z+1, this.bounds.max.z-1));
        this.mesh.position.set(x, y, z);

        this.scene.add(this.mesh);
    }
}

class CollisionHandler {
    constructor(snake, food, bounds) {
        this.snake = snake;
        this.food = food;
        this.bounds = bounds;
    }

    checkWallCollision() {
        const head = this.snake.body[0];
        const position = head.position;

        return (
            position.x < this.bounds.min.x ||
            position.x > this.bounds.max.x ||
            position.y < this.bounds.min.y ||
            position.y > this.bounds.max.y ||
            position.z < this.bounds.min.z ||
            position.z > this.bounds.max.z
        );
    }

    checkSelfCollision() {
        const head = this.snake.body[0];
        for (let i = 1; i < this.snake.body.length; i++) {
            if (head.position.equals(this.snake.body[i].position)) {
                return true;
            }
        }
        return false;
    }

    checkFoodCollision() {
        const head = this.snake.body[0];
        return head.position.distanceTo(this.food.mesh.position) < 1;
    }
}

class SnakeEntity {
    constructor(scene) {
        this.scene = scene;
        this.body = [];
        this.direction = new THREE.Vector3(1, 0, 0); // Initial direction: moving along the X-axis
        this.speed = 1; // Move one unit per step

        this.initializeSnake();
    }

    initializeSnake() {
        // Start the snake in the middle of the 0-20 x,y,z cube
        const startX = 10; // Middle of the x-axis
        const startY = 10; // Middle of the y-axis
        const startZ = 10; // Middle of the z-axis

        // Create the initial snake body (3 segments) with cyan cubes
        for (let i = 0; i < 3; i++) {
            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const material = new THREE.MeshStandardMaterial({ color: 0x00ffff }); // Cyan color
            const segment = new THREE.Mesh(geometry, material);
            segment.position.set(startX - i, startY, startZ); // Position segments in a line
            segment.castShadow = true; // Enable shadow casting
            this.body.push(segment);
            this.scene.add(segment);
        }
    }

    resetSnake() {
        // Remove all segments from the scene
        this.body.forEach(segment => this.scene.remove(segment));
        this.body = [];
        this.initializeSnake();
    }

    move() {
        // Move the snake by updating the position of each segment
        for (let i = this.body.length - 1; i > 0; i--) {
            this.body[i].position.copy(this.body[i - 1].position);
        }
        this.body[0].position.add(this.direction.clone().multiplyScalar(this.speed));
    }

    grow() {
        const lastSegment = this.body[this.body.length - 1];
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({ color: 0x00ffff }); // Cyan color
        const newSegment = new THREE.Mesh(geometry, material);

        // Position the new segment at the same position as the last segment
        newSegment.position.copy(lastSegment.position);
        this.body.push(newSegment);
        this.scene.add(newSegment);
    }

    changeDirection(newDirection) {
        this.direction.copy(newDirection);
    }

    changeHeadColorToRed() {
        if (this.body.length > 0) {
            const head = this.body[0];
            head.material.color.set(0xff0000); // Change head color to red
        }
    }
}

class InputHandler {
    constructor() {
        this.keyMap = {
            KeyE: new THREE.Vector3(0, 1, 0),  // Move up
            KeyQ: new THREE.Vector3(0, -1, 0), // Move down
            KeyA: new THREE.Vector3(-1, 0, 0), // Move left
            KeyD: new THREE.Vector3(1, 0, 0),  // Move right
            KeyS: new THREE.Vector3(0, 0, 1),  // Move forward (up in Z-axis)
            KeyW: new THREE.Vector3(0, 0, -1)  // Move backward (down in Z-axis)
        };
        this.currentInput = new THREE.Vector3(1, 0, 0); // Default direction
        this.lastDirection = new THREE.Vector3(1, 0, 0); // Track the last valid direction
        this.isSpeedBoostActive = false; // Track if the space bar is held down

        this.listenForInput();
    }

    listenForInput() {
        window.addEventListener("keydown", (event) => {
            const newDirection = this.keyMap[event.code];
            if (newDirection) {
                // Prevent doubling back by ensuring the new direction is not the opposite of the last direction
                if (!newDirection.equals(this.lastDirection.clone().negate())) {
                    this.currentInput.copy(newDirection);
                }
            }
            if (event.code === "Space") {
                this.isSpeedBoostActive = true; // Activate speed boost
            }
            if (event.code === "KeyR") {
                window.dispatchEvent(new Event("resetGame"));
            }
            if (event.code === "KeyI") {
                gameRenderer.toggleControlsInfo(); // Toggle controls info window
            }
        });

        window.addEventListener("keyup", (event) => {
            if (event.code === "Space") {
                this.isSpeedBoostActive = false; // Deactivate speed boost
            }
        });
    }

    getDirection() {
        this.lastDirection.copy(this.currentInput); // Update the last valid direction
        return this.currentInput;
    }
}

// Main game setup
const gameRenderer = new GameRenderer();
const bounds = new THREE.Box3(
    new THREE.Vector3(0, 0, 0), // Adjusted bounds to start at 0
    new THREE.Vector3(20, 20, 20) // Adjusted bounds to end at 10
);
const snake = new SnakeEntity(gameRenderer.scene);
const food = new FoodEntity(gameRenderer.scene, bounds);
const collisionHandler = new CollisionHandler(snake, food, bounds);
const inputHandler = new InputHandler();

function resetGame() {
    gameRenderer.resetGame(); // Reset score and gameOver state
    snake.resetSnake(); // Reset the snake to its initial state
    food.generateNewPosition(); // Generate a new position for the food
    gameRenderer.updateUI(0, snake.body.length, snake.body[0].position); // Update the UI with initial values
    lastMoveTime = 0; // Reset the last move time to ensure proper timing
}

let lastMoveTime = 0;
const moveInterval = 1000; // Snake moves once per second (1000ms)

function animate(time) {
    const currentMoveInterval = inputHandler.isSpeedBoostActive ? moveInterval / 3 : moveInterval; // Decrease the interval if speed boost is active

    // Calculate time since the last move
    if (!gameRenderer.gameOver && time - lastMoveTime >= currentMoveInterval) {
        // Update snake direction and move
        snake.changeDirection(inputHandler.getDirection());
        snake.move();

        // Check collisions
        if (collisionHandler.checkWallCollision() || collisionHandler.checkSelfCollision()) {
            gameRenderer.showGameOver();
            snake.changeHeadColorToRed(); // Change the head color to red
        } else if (collisionHandler.checkFoodCollision()) {
            snake.grow();
            food.generateNewPosition();
            gameRenderer.updateScore(gameRenderer.score + 1);
        }

        // Update UI
        gameRenderer.updateUI(gameRenderer.score, snake.body.length, snake.body[0].position);

        // Update the last move time
        lastMoveTime = time;
    }

    gameRenderer.renderScene();

    requestAnimationFrame(animate);
}

// Listen for reset game event
window.addEventListener("resetGame", resetGame);

// Start the animation loop
requestAnimationFrame(animate);