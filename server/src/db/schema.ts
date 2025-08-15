import { serial, text, pgTable, timestamp, numeric, integer, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', ['customer', 'driver', 'merchant']);
export const vehicleTypeEnum = pgEnum('vehicle_type', ['motorcycle', 'car', 'bicycle']);
export const rideStatusEnum = pgEnum('ride_status', ['pending', 'accepted', 'in_progress', 'completed', 'cancelled']);
export const orderStatusEnum = pgEnum('order_status', ['pending', 'accepted', 'preparing', 'ready_for_pickup', 'on_the_way', 'delivered', 'cancelled']);
export const transactionTypeEnum = pgEnum('transaction_type', ['topup', 'withdrawal', 'payment', 'refund']);
export const transactionStatusEnum = pgEnum('transaction_status', ['pending', 'success', 'failed']);
export const notificationTypeEnum = pgEnum('notification_type', ['ride_update', 'order_update', 'promotion', 'message', 'location_update']);

// Users table
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  phone: text('phone').notNull().unique(),
  name: text('name').notNull(),
  role: userRoleEnum('role').notNull(),
  avatar_url: text('avatar_url'),
  is_active: boolean('is_active').notNull().default(true),
  wallet_balance: numeric('wallet_balance', { precision: 12, scale: 2 }).notNull().default('0'),
  points: integer('points').notNull().default(0),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Drivers table
export const driversTable = pgTable('drivers', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => usersTable.id),
  vehicle_type: vehicleTypeEnum('vehicle_type').notNull(),
  license_plate: text('license_plate').notNull(),
  license_number: text('license_number').notNull(),
  vehicle_brand: text('vehicle_brand').notNull(),
  vehicle_model: text('vehicle_model').notNull(),
  is_available: boolean('is_available').notNull().default(true),
  current_latitude: numeric('current_latitude', { precision: 10, scale: 8 }),
  current_longitude: numeric('current_longitude', { precision: 11, scale: 8 }),
  rating: numeric('rating', { precision: 3, scale: 2 }).notNull().default('5.0'),
  total_rides: integer('total_rides').notNull().default(0),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Merchants table
export const merchantsTable = pgTable('merchants', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => usersTable.id),
  business_name: text('business_name').notNull(),
  business_address: text('business_address').notNull(),
  latitude: numeric('latitude', { precision: 10, scale: 8 }).notNull(),
  longitude: numeric('longitude', { precision: 11, scale: 8 }).notNull(),
  phone: text('phone').notNull(),
  cuisine_type: text('cuisine_type'),
  is_open: boolean('is_open').notNull().default(true),
  rating: numeric('rating', { precision: 3, scale: 2 }).notNull().default('5.0'),
  total_orders: integer('total_orders').notNull().default(0),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Menu Items table
export const menuItemsTable = pgTable('menu_items', {
  id: serial('id').primaryKey(),
  merchant_id: integer('merchant_id').notNull().references(() => merchantsTable.id),
  name: text('name').notNull(),
  description: text('description'),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  image_url: text('image_url'),
  is_available: boolean('is_available').notNull().default(true),
  category: text('category').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Rides table
export const ridesTable = pgTable('rides', {
  id: serial('id').primaryKey(),
  customer_id: integer('customer_id').notNull().references(() => usersTable.id),
  driver_id: integer('driver_id').references(() => driversTable.id),
  vehicle_type: vehicleTypeEnum('vehicle_type').notNull(),
  pickup_address: text('pickup_address').notNull(),
  pickup_latitude: numeric('pickup_latitude', { precision: 10, scale: 8 }).notNull(),
  pickup_longitude: numeric('pickup_longitude', { precision: 11, scale: 8 }).notNull(),
  destination_address: text('destination_address').notNull(),
  destination_latitude: numeric('destination_latitude', { precision: 10, scale: 8 }).notNull(),
  destination_longitude: numeric('destination_longitude', { precision: 11, scale: 8 }).notNull(),
  status: rideStatusEnum('status').notNull().default('pending'),
  fare: numeric('fare', { precision: 10, scale: 2 }).notNull(),
  distance_km: numeric('distance_km', { precision: 8, scale: 3 }).notNull(),
  duration_minutes: integer('duration_minutes'),
  notes: text('notes'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Food Orders table
export const foodOrdersTable = pgTable('food_orders', {
  id: serial('id').primaryKey(),
  customer_id: integer('customer_id').notNull().references(() => usersTable.id),
  merchant_id: integer('merchant_id').notNull().references(() => merchantsTable.id),
  driver_id: integer('driver_id').references(() => driversTable.id),
  delivery_address: text('delivery_address').notNull(),
  delivery_latitude: numeric('delivery_latitude', { precision: 10, scale: 8 }).notNull(),
  delivery_longitude: numeric('delivery_longitude', { precision: 11, scale: 8 }).notNull(),
  status: orderStatusEnum('status').notNull().default('pending'),
  subtotal: numeric('subtotal', { precision: 10, scale: 2 }).notNull(),
  delivery_fee: numeric('delivery_fee', { precision: 10, scale: 2 }).notNull(),
  total_amount: numeric('total_amount', { precision: 10, scale: 2 }).notNull(),
  notes: text('notes'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Order Items table
export const orderItemsTable = pgTable('order_items', {
  id: serial('id').primaryKey(),
  order_id: integer('order_id').notNull().references(() => foodOrdersTable.id),
  menu_item_id: integer('menu_item_id').notNull().references(() => menuItemsTable.id),
  quantity: integer('quantity').notNull(),
  price_per_item: numeric('price_per_item', { precision: 10, scale: 2 }).notNull(),
  total_price: numeric('total_price', { precision: 10, scale: 2 }).notNull(),
  special_instructions: text('special_instructions'),
});

// Wallet Transactions table
export const walletTransactionsTable = pgTable('wallet_transactions', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => usersTable.id),
  type: transactionTypeEnum('type').notNull(),
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
  status: transactionStatusEnum('status').notNull().default('pending'),
  duitku_reference: text('duitku_reference'),
  description: text('description').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Notifications table
export const notificationsTable = pgTable('notifications', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => usersTable.id),
  type: notificationTypeEnum('type').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  is_read: boolean('is_read').notNull().default(false),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(usersTable, ({ one, many }) => ({
  driver: one(driversTable),
  merchant: one(merchantsTable),
  rides: many(ridesTable),
  orders: many(foodOrdersTable),
  transactions: many(walletTransactionsTable),
  notifications: many(notificationsTable),
}));

export const driversRelations = relations(driversTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [driversTable.user_id],
    references: [usersTable.id],
  }),
  rides: many(ridesTable),
  deliveries: many(foodOrdersTable),
}));

export const merchantsRelations = relations(merchantsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [merchantsTable.user_id],
    references: [usersTable.id],
  }),
  menuItems: many(menuItemsTable),
  orders: many(foodOrdersTable),
}));

export const menuItemsRelations = relations(menuItemsTable, ({ one, many }) => ({
  merchant: one(merchantsTable, {
    fields: [menuItemsTable.merchant_id],
    references: [merchantsTable.id],
  }),
  orderItems: many(orderItemsTable),
}));

export const ridesRelations = relations(ridesTable, ({ one }) => ({
  customer: one(usersTable, {
    fields: [ridesTable.customer_id],
    references: [usersTable.id],
  }),
  driver: one(driversTable, {
    fields: [ridesTable.driver_id],
    references: [driversTable.id],
  }),
}));

export const foodOrdersRelations = relations(foodOrdersTable, ({ one, many }) => ({
  customer: one(usersTable, {
    fields: [foodOrdersTable.customer_id],
    references: [usersTable.id],
  }),
  merchant: one(merchantsTable, {
    fields: [foodOrdersTable.merchant_id],
    references: [merchantsTable.id],
  }),
  driver: one(driversTable, {
    fields: [foodOrdersTable.driver_id],
    references: [driversTable.id],
  }),
  items: many(orderItemsTable),
}));

export const orderItemsRelations = relations(orderItemsTable, ({ one }) => ({
  order: one(foodOrdersTable, {
    fields: [orderItemsTable.order_id],
    references: [foodOrdersTable.id],
  }),
  menuItem: one(menuItemsTable, {
    fields: [orderItemsTable.menu_item_id],
    references: [menuItemsTable.id],
  }),
}));

export const walletTransactionsRelations = relations(walletTransactionsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [walletTransactionsTable.user_id],
    references: [usersTable.id],
  }),
}));

export const notificationsRelations = relations(notificationsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [notificationsTable.user_id],
    references: [usersTable.id],
  }),
}));

// Export all tables for drizzle queries
export const tables = {
  users: usersTable,
  drivers: driversTable,
  merchants: merchantsTable,
  menuItems: menuItemsTable,
  rides: ridesTable,
  foodOrders: foodOrdersTable,
  orderItems: orderItemsTable,
  walletTransactions: walletTransactionsTable,
  notifications: notificationsTable,
};