import { z } from 'zod';

// Enums
export const userRoleSchema = z.enum(['customer', 'driver', 'merchant']);
export type UserRole = z.infer<typeof userRoleSchema>;

export const vehicleTypeSchema = z.enum(['motorcycle', 'car', 'bicycle']);
export type VehicleType = z.infer<typeof vehicleTypeSchema>;

export const rideStatusSchema = z.enum(['pending', 'accepted', 'in_progress', 'completed', 'cancelled']);
export type RideStatus = z.infer<typeof rideStatusSchema>;

export const orderStatusSchema = z.enum(['pending', 'accepted', 'preparing', 'ready_for_pickup', 'on_the_way', 'delivered', 'cancelled']);
export type OrderStatus = z.infer<typeof orderStatusSchema>;

export const transactionTypeSchema = z.enum(['topup', 'withdrawal', 'payment', 'refund']);
export type TransactionType = z.infer<typeof transactionTypeSchema>;

export const transactionStatusSchema = z.enum(['pending', 'success', 'failed']);
export type TransactionStatus = z.infer<typeof transactionStatusSchema>;

export const notificationTypeSchema = z.enum(['ride_update', 'order_update', 'promotion', 'message', 'location_update']);
export type NotificationType = z.infer<typeof notificationTypeSchema>;

// User schemas
export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  phone: z.string(),
  name: z.string(),
  role: userRoleSchema,
  avatar_url: z.string().nullable(),
  is_active: z.boolean(),
  wallet_balance: z.number(),
  points: z.number().int(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type User = z.infer<typeof userSchema>;

export const createUserInputSchema = z.object({
  email: z.string().email(),
  phone: z.string(),
  name: z.string(),
  role: userRoleSchema,
  avatar_url: z.string().nullable().optional()
});

export type CreateUserInput = z.infer<typeof createUserInputSchema>;

export const updateUserInputSchema = z.object({
  id: z.number(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  name: z.string().optional(),
  avatar_url: z.string().nullable().optional(),
  is_active: z.boolean().optional()
});

export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;

// Driver schemas
export const driverSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  vehicle_type: vehicleTypeSchema,
  license_plate: z.string(),
  license_number: z.string(),
  vehicle_brand: z.string(),
  vehicle_model: z.string(),
  is_available: z.boolean(),
  current_latitude: z.number().nullable(),
  current_longitude: z.number().nullable(),
  rating: z.number(),
  total_rides: z.number().int(),
  created_at: z.coerce.date()
});

export type Driver = z.infer<typeof driverSchema>;

export const createDriverInputSchema = z.object({
  user_id: z.number(),
  vehicle_type: vehicleTypeSchema,
  license_plate: z.string(),
  license_number: z.string(),
  vehicle_brand: z.string(),
  vehicle_model: z.string()
});

export type CreateDriverInput = z.infer<typeof createDriverInputSchema>;

// Merchant schemas
export const merchantSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  business_name: z.string(),
  business_address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  phone: z.string(),
  cuisine_type: z.string().nullable(),
  is_open: z.boolean(),
  rating: z.number(),
  total_orders: z.number().int(),
  created_at: z.coerce.date()
});

export type Merchant = z.infer<typeof merchantSchema>;

export const createMerchantInputSchema = z.object({
  user_id: z.number(),
  business_name: z.string(),
  business_address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  phone: z.string(),
  cuisine_type: z.string().nullable().optional()
});

export type CreateMerchantInput = z.infer<typeof createMerchantInputSchema>;

// Menu Item schemas
export const menuItemSchema = z.object({
  id: z.number(),
  merchant_id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  price: z.number(),
  image_url: z.string().nullable(),
  is_available: z.boolean(),
  category: z.string(),
  created_at: z.coerce.date()
});

export type MenuItem = z.infer<typeof menuItemSchema>;

export const createMenuItemInputSchema = z.object({
  merchant_id: z.number(),
  name: z.string(),
  description: z.string().nullable().optional(),
  price: z.number().positive(),
  image_url: z.string().nullable().optional(),
  category: z.string()
});

export type CreateMenuItemInput = z.infer<typeof createMenuItemInputSchema>;

// Ride schemas
export const rideSchema = z.object({
  id: z.number(),
  customer_id: z.number(),
  driver_id: z.number().nullable(),
  vehicle_type: vehicleTypeSchema,
  pickup_address: z.string(),
  pickup_latitude: z.number(),
  pickup_longitude: z.number(),
  destination_address: z.string(),
  destination_latitude: z.number(),
  destination_longitude: z.number(),
  status: rideStatusSchema,
  fare: z.number(),
  distance_km: z.number(),
  duration_minutes: z.number().int().nullable(),
  notes: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Ride = z.infer<typeof rideSchema>;

export const createRideInputSchema = z.object({
  customer_id: z.number(),
  vehicle_type: vehicleTypeSchema,
  pickup_address: z.string(),
  pickup_latitude: z.number(),
  pickup_longitude: z.number(),
  destination_address: z.string(),
  destination_latitude: z.number(),
  destination_longitude: z.number(),
  notes: z.string().nullable().optional()
});

export type CreateRideInput = z.infer<typeof createRideInputSchema>;

// Food Order schemas
export const foodOrderSchema = z.object({
  id: z.number(),
  customer_id: z.number(),
  merchant_id: z.number(),
  driver_id: z.number().nullable(),
  delivery_address: z.string(),
  delivery_latitude: z.number(),
  delivery_longitude: z.number(),
  status: orderStatusSchema,
  subtotal: z.number(),
  delivery_fee: z.number(),
  total_amount: z.number(),
  notes: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type FoodOrder = z.infer<typeof foodOrderSchema>;

export const createFoodOrderInputSchema = z.object({
  customer_id: z.number(),
  merchant_id: z.number(),
  delivery_address: z.string(),
  delivery_latitude: z.number(),
  delivery_longitude: z.number(),
  items: z.array(z.object({
    menu_item_id: z.number(),
    quantity: z.number().int().positive(),
    special_instructions: z.string().nullable().optional()
  })),
  notes: z.string().nullable().optional()
});

export type CreateFoodOrderInput = z.infer<typeof createFoodOrderInputSchema>;

// Order Item schemas
export const orderItemSchema = z.object({
  id: z.number(),
  order_id: z.number(),
  menu_item_id: z.number(),
  quantity: z.number().int(),
  price_per_item: z.number(),
  total_price: z.number(),
  special_instructions: z.string().nullable()
});

export type OrderItem = z.infer<typeof orderItemSchema>;

// Wallet Transaction schemas
export const walletTransactionSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  type: transactionTypeSchema,
  amount: z.number(),
  status: transactionStatusSchema,
  duitku_reference: z.string().nullable(),
  description: z.string(),
  created_at: z.coerce.date()
});

export type WalletTransaction = z.infer<typeof walletTransactionSchema>;

export const createWalletTransactionInputSchema = z.object({
  user_id: z.number(),
  type: transactionTypeSchema,
  amount: z.number().positive(),
  description: z.string()
});

export type CreateWalletTransactionInput = z.infer<typeof createWalletTransactionInputSchema>;

// Notification schemas
export const notificationSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  type: notificationTypeSchema,
  title: z.string(),
  message: z.string(),
  is_read: z.boolean(),
  created_at: z.coerce.date()
});

export type Notification = z.infer<typeof notificationSchema>;

export const createNotificationInputSchema = z.object({
  user_id: z.number(),
  type: notificationTypeSchema,
  title: z.string(),
  message: z.string()
});

export type CreateNotificationInput = z.infer<typeof createNotificationInputSchema>;