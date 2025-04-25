# Module 6 Programming Project

This project is a 3D game built using [Three.js](https://threejs.org/). It features a snake-like game where the player controls a snake in a 3D environment, collects food, and avoids collisions with walls or itself. The game includes dynamic lighting, shadows, and user interface elements.

## Features

- **3D Snake Game**: Navigate a snake in a 3D space, collect food, and grow in size.
- **Dynamic Lighting**: Ambient, point, and spotlight effects for enhanced visuals.
- **Collision Detection**: Detect collisions with walls, food, and the snake's own body.
- **User Interface**: Display score, snake length, and position in real-time.
- **Camera Controls**: Use OrbitControls for smooth camera movement.
- **Speed Boost**: Press the space bar to temporarily increase the snake's speed.
- **Game Reset**: Press `R` to reset the game.

## Installation

1. Clone the repository or download the project files.
2. Navigate to the project directory.
3. Install dependencies using npm:
    ```bash
    npm install
    ```

## Usage

1. Start the development server:
    ```bash
    npx vite
    ```
2. Open your browser and navigate to `http://localhost:3000` (or the port specified by Vite).
3. Use the following controls to play the game:
    - `W`: Move backward (negative Z-axis)
    - `S`: Move forward (positive Z-axis)
    - `A`: Move left (negative X-axis)
    - `D`: Move right (positive X-axis)
    - `E`: Move up (positive Y-axis)
    - `Q`: Move down (negative Y-axis)
    - `Space`: Activate speed boost
    - `R`: Reset the game

## Project Structure

- **`index.html`**: Entry point for the application.
- **`script.js`**: Main game logic, including rendering, input handling, and collision detection.
- **`.gitignore`**: Specifies files and directories to ignore in version control.
- **`package.json`**: Lists project dependencies.

## Dependencies

- [Three.js](https://threejs.org/) - A JavaScript 3D library.
- [Vite](https://vitejs.dev/) - Build tool for modern web projects.

## License

This project is for educational purposes and is not licensed for commercial use.

## Acknowledgments

- [Three.js Documentation](https://threejs.org/docs/)
- [Vite Documentation](https://vitejs.dev/guide/)

Enjoy the game!  