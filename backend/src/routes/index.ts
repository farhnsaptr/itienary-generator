import { Router } from "express";
import { authRoutes } from "../modules/auth";
import { usersRoutes } from "../modules/users";
import { tripsRoutes } from "../modules/trips";
import { tripMembersRoutes } from "../modules/trip-members";
import { tripActivitiesRouter, activitiesRouter } from "../modules/activities";
import { activityPhotosRouter, directPhotosRouter } from "../modules/activity-photos";
import { adminRoutes } from "../modules/admin";

const router = Router();

// Auth routes
router.use("/auth", authRoutes);

// User management routes
router.use("/users", usersRoutes);

// Trip routes & nested members/activities
router.use("/trips", tripsRoutes);
router.use("/trips/:tripId/members", tripMembersRoutes);
router.use("/trips/:tripId/activities", tripActivitiesRouter);

// Direct activities & activity photos
router.use("/activities", activitiesRouter);
router.use("/activities/:activityId/photos", activityPhotosRouter);
router.use("/photos", directPhotosRouter);

// Admin dashboard routes
router.use("/admin", adminRoutes);

export default router;
