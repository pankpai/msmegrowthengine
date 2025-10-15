import { Router } from "express";
import {
  getCreditUsesperMonth,
  handleAddPlanofServices,
  handleCreateOrder,
  handleCreditManagement,
  handleGetPlanofServices,
  handleGetSubscriptionByUserId,
  verifyPayment,
} from "../controller/plan.controller";
import { authenticateUser } from "../middleware/middleware";
const router: Router = Router();

router.route("/create-plan").post(handleAddPlanofServices);
router.route("/get-plan/:serviceKey").get(handleGetPlanofServices);

// route for subscription
router.route("/create-order").post(authenticateUser, handleCreateOrder);
router.route("/verify-payment").post(authenticateUser, verifyPayment);

// info about subscription
router
  .route("/get-subscription-detail")
  .get(authenticateUser, handleGetSubscriptionByUserId);
router.route("/manage-credit").post(handleCreditManagement);
router.route("/get-credit-uses").get(authenticateUser, getCreditUsesperMonth);
export default router;
