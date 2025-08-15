import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schemas
import { 
  createUserInputSchema,
  updateUserInputSchema,
  createDriverInputSchema,
  createMerchantInputSchema,
  createMenuItemInputSchema,
  createRideInputSchema,
  createFoodOrderInputSchema,
  createWalletTransactionInputSchema,
  createNotificationInputSchema,
  rideStatusSchema,
  orderStatusSchema,
  vehicleTypeSchema,
  userRoleSchema,
  notificationTypeSchema
} from './schema';

// Import handlers
import { createUser } from './handlers/create_user';
import { getUsers } from './handlers/get_users';
import { updateUser } from './handlers/update_user';
import { createDriver } from './handlers/create_driver';
import { getAvailableDrivers } from './handlers/get_available_drivers';
import { updateDriverLocation } from './handlers/update_driver_location';
import { createMerchant } from './handlers/create_merchant';
import { getMerchants } from './handlers/get_merchants';
import { createMenuItem } from './handlers/create_menu_item';
import { getMenuItems } from './handlers/get_menu_items';
import { createRide } from './handlers/create_ride';
import { getRides } from './handlers/get_rides';
import { updateRideStatus } from './handlers/update_ride_status';
import { createFoodOrder } from './handlers/create_food_order';
import { getFoodOrders } from './handlers/get_food_orders';
import { updateOrderStatus } from './handlers/update_order_status';
import { createWalletTransaction } from './handlers/create_wallet_transaction';
import { getWalletTransactions } from './handlers/get_wallet_transactions';
import { updateWalletBalance } from './handlers/update_wallet_balance';
import { createNotification } from './handlers/create_notification';
import { getNotifications } from './handlers/get_notifications';
import { markNotificationRead } from './handlers/mark_notification_read';
import { updateUserPoints } from './handlers/update_user_points';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // User management
  createUser: publicProcedure
    .input(createUserInputSchema)
    .mutation(({ input }) => createUser(input)),
  
  getUsers: publicProcedure
    .input(z.object({ role: userRoleSchema.optional() }))
    .query(() => getUsers()),
  
  updateUser: publicProcedure
    .input(updateUserInputSchema)
    .mutation(({ input }) => updateUser(input)),

  updateUserPoints: publicProcedure
    .input(z.object({
      userId: z.number(),
      points: z.number().int(),
      operation: z.enum(['add', 'subtract'])
    }))
    .mutation(({ input }) => updateUserPoints(input.userId, input.points, input.operation)),

  // Driver management
  createDriver: publicProcedure
    .input(createDriverInputSchema)
    .mutation(({ input }) => createDriver(input)),

  getAvailableDrivers: publicProcedure
    .input(z.object({ vehicleType: vehicleTypeSchema.optional() }))
    .query(({ input }) => getAvailableDrivers(input.vehicleType)),

  updateDriverLocation: publicProcedure
    .input(z.object({
      driverId: z.number(),
      latitude: z.number(),
      longitude: z.number()
    }))
    .mutation(({ input }) => updateDriverLocation(input.driverId, input.latitude, input.longitude)),

  // Merchant management
  createMerchant: publicProcedure
    .input(createMerchantInputSchema)
    .mutation(({ input }) => createMerchant(input)),

  getMerchants: publicProcedure.query(() => getMerchants()),

  // Menu management
  createMenuItem: publicProcedure
    .input(createMenuItemInputSchema)
    .mutation(({ input }) => createMenuItem(input)),

  getMenuItems: publicProcedure
    .input(z.object({ merchantId: z.number() }))
    .query(({ input }) => getMenuItems(input.merchantId)),

  // Ride management
  createRide: publicProcedure
    .input(createRideInputSchema)
    .mutation(({ input }) => createRide(input)),

  getRides: publicProcedure
    .input(z.object({
      userId: z.number().optional(),
      status: rideStatusSchema.optional()
    }))
    .query(({ input }) => getRides(input.userId, input.status)),

  updateRideStatus: publicProcedure
    .input(z.object({
      rideId: z.number(),
      status: rideStatusSchema,
      driverId: z.number().optional()
    }))
    .mutation(({ input }) => updateRideStatus(input.rideId, input.status, input.driverId)),

  // Food order management
  createFoodOrder: publicProcedure
    .input(createFoodOrderInputSchema)
    .mutation(({ input }) => createFoodOrder(input)),

  getFoodOrders: publicProcedure
    .input(z.object({
      userId: z.number().optional(),
      role: z.string().optional(),
      status: orderStatusSchema.optional()
    }))
    .query(({ input }) => getFoodOrders(input.userId, input.role, input.status)),

  updateOrderStatus: publicProcedure
    .input(z.object({
      orderId: z.number(),
      status: orderStatusSchema,
      driverId: z.number().optional()
    }))
    .mutation(({ input }) => updateOrderStatus(input.orderId, input.status, input.driverId)),

  // Wallet management
  createWalletTransaction: publicProcedure
    .input(createWalletTransactionInputSchema)
    .mutation(({ input }) => createWalletTransaction(input)),

  getWalletTransactions: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(({ input }) => getWalletTransactions(input.userId)),

  updateWalletBalance: publicProcedure
    .input(z.object({
      userId: z.number(),
      amount: z.number().positive(),
      operation: z.enum(['add', 'subtract'])
    }))
    .mutation(({ input }) => updateWalletBalance(input.userId, input.amount, input.operation)),

  // Notification management
  createNotification: publicProcedure
    .input(createNotificationInputSchema)
    .mutation(({ input }) => createNotification(input)),

  getNotifications: publicProcedure
    .input(z.object({
      userId: z.number(),
      unreadOnly: z.boolean().optional()
    }))
    .query(({ input }) => getNotifications(input.userId, input.unreadOnly)),

  markNotificationRead: publicProcedure
    .input(z.object({ notificationId: z.number() }))
    .mutation(({ input }) => markNotificationRead(input.notificationId)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`🚀 Rocket TRPC server listening at port: ${port}`);
}

start();