# CoreX Fitness - Frontend Interface

The CoreX Fitness frontend is a responsive, high-performance web application designed for modern fitness tracking. It features a "Dark Mode" aesthetic built for high readability and user engagement.

### 🛠 Tech Stack
* **Languages:** HTML5, CSS3, JavaScript (ES6).
* **Design:** Custom Dark Mode (#121212) with Neon Blue accents (#3aa7ff).
* **API Communication:** Asynchronous `fetch` API for RESTful interaction.

### ✨ Key Features
* **Dynamic Content:** Program cards (Training/Diet) are generated programmatically via JavaScript objects.
* **Smart Filtering:** Toggles between "All," "Training," and "Diet" views without page reloads.
* **Client-Side Validation:** Enforces password length (min 6 chars), email format, and positive number checks for body stats.
* **Interactive Elements:** 0.3s button transitions and 3D hover effects on program cards.

### 🎨 Design System
* **Typography:** 'Poppins' for body text and italicized 'Montserrat' for headings.
* **Layout:** Utilizes CSS Grid (repeat(2, 1fr)) for feature sections to ensure responsiveness.
* **User Feedback:** Immediate visual feedback via browser alerts for login success or validation errors.
