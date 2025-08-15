import { type CreateMenuItemInput, type MenuItem } from '../schema';

export async function createMenuItem(input: CreateMenuItemInput): Promise<MenuItem> {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this handler is creating a new menu item for a merchant and persisting it in the database.
    return Promise.resolve({
        id: 0, // Placeholder ID
        merchant_id: input.merchant_id,
        name: input.name,
        description: input.description || null,
        price: input.price,
        image_url: input.image_url || null,
        is_available: true,
        category: input.category,
        created_at: new Date()
    } as MenuItem);
}