const express = require('express');
const router = express.Router();
const agnetController = require('../controllers/agentController'); // Update the path if necessary
const agentAuthMiddleware=require('../authMiddleware/agentAuthMiddleware')

// Customer registration route
router.post('/agentregister', agnetController.register);
//customer login
router.post('/agentlogin', agnetController.login);

//get customer data
router.route("/agentdata").get(agentAuthMiddleware, agnetController.agent);

//get customerDetails of customer
// router.route("/:customerId").get(customerAuthMiddleware, customerController.getCustomerWithAdminDetails);
// router.get('/:customerId', customerController.getCustomerWithAdminDetails);

module.exports = router;

