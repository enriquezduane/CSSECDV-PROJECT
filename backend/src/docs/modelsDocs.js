/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - password
 *         - role
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the user
 *         username:
 *           type: string
 *           description: The username of the user
 *         password:
 *           type: string
 *           description: The hashed password of the user
 *         role:
 *           type: string
 *           enum: [cashier, manager]
 *           description: The role of the user
 *         currentLogin:
 *           type: string
 *           format: date-time
 *           description: The timestamp of the current login
 *         previousLogin:
 *           type: string
 *           format: date-time
 *           description: The timestamp of the previous login
 *         securityQuestions:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *                 description: The security question
 *               answerHash:
 *                 type: string
 *                 description: The hashed answer to the security question
 *       example:
 *         id: 64f8c9e2b5d3c2a1b2c3d4e5
 *         username: cashier1
 *         password: hashedpassword123
 *         role: cashier
 *         currentLogin: 2023-10-01T14:30:00Z
 *         previousLogin: 2023-09-30T10:15:00Z
 *         securityQuestions:
 *           - question: What is your favorite color?
 *             answerHash: hashedAnswer123
 *
 *     MenuItem:
 *       type: object
 *       required:
 *         - type
 *         - item
 *         - price
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the menu item
 *         type:
 *           type: string
 *           description: The category of the menu item (e.g., Drinks, Burgers)
 *         item:
 *           type: string
 *           description: The name of the menu item
 *         price:
 *           type: number
 *           description: The price of the menu item
 *       example:
 *         id: 64f8c9e2b5d3c2a1b2c3d4e5
 *         type: Drinks
 *         item: Iced Tea
 *         price: 50
 *
 *     Order:
 *       type: object
 *       required:
 *         - cashier
 *         - items
 *         - paymentMethod
 *         - totalAmount
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the order
 *         cashier:
 *           type: string
 *           description: The ID of the cashier who processed the order
 *         customerName:
 *           type: string
 *           description: The name of the customer
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               item:
 *                 type: string
 *                 description: The ID of the menu item
 *               quantity:
 *                 type: number
 *                 description: The quantity of the menu item
 *         paymentMethod:
 *           type: string
 *           enum: [GCash, Cash, Card]
 *           description: The payment method used for the order
 *         totalAmount:
 *           type: number
 *           description: The total amount of the order
 *         timeOrdered:
 *           type: string
 *           format: date-time
 *           description: The timestamp of when the order was placed
 *       example:
 *         id: 64f8c9e2b5d3c2a1b2c3d4e5
 *         cashier: 64f8c9e2b5d3c2a1b2c3d4e5
 *         customerName: John Doe
 *         items:
 *           - item: 64f8c9e2b5d3c2a1b2c3d4e5
 *             quantity: 2
 *         paymentMethod: GCash
 *         totalAmount: 200
 *         timeOrdered: 2023-10-01T14:30:00Z
 */