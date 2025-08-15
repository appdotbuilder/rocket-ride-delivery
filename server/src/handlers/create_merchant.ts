import { type CreateMerchantInput, type Merchant } from '../schema';

export async function createMerchant(input: CreateMerchantInput): Promise<Merchant> {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this handler is creating a new merchant profile for an existing user and persisting it in the database.
    return Promise.resolve({
        id: 0, // Placeholder ID
        user_id: input.user_id,
        business_name: input.business_name,
        business_address: input.business_address,
        latitude: input.latitude,
        longitude: input.longitude,
        phone: input.phone,
        cuisine_type: input.cuisine_type || null,
        is_open: true,
        rating: 5.0,
        total_orders: 0,
        created_at: new Date()
    } as Merchant);
}