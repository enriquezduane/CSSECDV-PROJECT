/**
 * @swagger
 * tags:
 *   name: Login
 *   description: Authentication and re-authentication endpoints
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Authenticate a user and return a JWT token
 *     tags: [Login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user
 *               password:
 *                 type: string
 *                 description: The password of the user
 *             example:
 *               username: cashier1
 *               password: password123
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: The JWT token for the authenticated user
 *                 username:
 *                   type: string
 *                   description: The username of the authenticated user
 *                 role:
 *                   type: string
 *                   enum: [cashier, manager]
 *                   description: The role of the authenticated user
 *                 id:
 *                   type: string
 *                   description: The ID of the authenticated user
 *                 previousLogin:
 *                   type: string
 *                   format: date-time
 *                   description: The timestamp of the user's previous login
 *       401:
 *         description: Invalid username and/or password
 *       403:
 *         description: Account is locked
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /login/re-authenticate/{id}:
 *   post:
 *     summary: Re-authenticate a user by verifying their current password
 *     tags: [Login]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to re-authenticate
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: The current password of the user
 *             example:
 *               currentPassword: password123
 *     responses:
 *       200:
 *         description: Re-authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *       401:
 *         description: "Re-authentication failed: Incorrect current password"
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */