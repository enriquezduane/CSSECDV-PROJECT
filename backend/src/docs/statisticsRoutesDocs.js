/**
 * @swagger
 * tags:
 *   name: Statistics
 *   description: Endpoints for retrieving dashboard statistics
 */

/**
 * @swagger
 * /statistics:
 *   get:
 *     summary: Get all dashboard statistics
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 today:
 *                   type: object
 *                   description: Statistics for today
 *                   properties:
 *                     totalOrders:
 *                       type: number
 *                       description: Total number of orders today
 *                     totalSales:
 *                       type: number
 *                       description: Total sales amount today
 *                     averageOrderValue:
 *                       type: number
 *                       description: Average value of orders today
 *                 weekly:
 *                   type: object
 *                   description: Statistics for the past week
 *                   properties:
 *                     totalOrders:
 *                       type: number
 *                       description: Total number of orders this week
 *                     totalSales:
 *                       type: number
 *                       description: Total sales amount this week
 *                     averageOrderValue:
 *                       type: number
 *                       description: Average value of orders this week
 *                 monthly:
 *                   type: object
 *                   description: Statistics for the past month
 *                   properties:
 *                     totalOrders:
 *                       type: number
 *                       description: Total number of orders this month
 *                     totalSales:
 *                       type: number
 *                       description: Total sales amount this month
 *                     averageOrderValue:
 *                       type: number
 *                       description: Average value of orders this month
 *                 topSellingItems:
 *                   type: array
 *                   description: Top 5 selling items
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         description: Name of the item
 *                       quantity:
 *                         type: number
 *                         description: Total quantity sold
 *                       revenue:
 *                         type: number
 *                         description: Total revenue generated
 *                 paymentMethods:
 *                   type: object
 *                   description: Statistics for payment methods
 *                   properties:
 *                     GCash:
 *                       type: number
 *                       description: Number of orders paid via GCash
 *                     Cash:
 *                       type: number
 *                       description: Number of orders paid via Cash
 *                     Card:
 *                       type: number
 *                       description: Number of orders paid via Card
 *                 cashierPerformance:
 *                   type: array
 *                   description: Performance of cashiers
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         description: Name of the cashier
 *                       totalOrders:
 *                         type: number
 *                         description: Total number of orders processed by the cashier
 *                       totalSales:
 *                         type: number
 *                         description: Total sales amount processed by the cashier
 *                 hourlyDistribution:
 *                   type: array
 *                   description: Hourly distribution of orders
 *                   items:
 *                     type: number
 *                     description: Number of orders for each hour (0-23)
 *       500:
 *         description: Internal server error
 */