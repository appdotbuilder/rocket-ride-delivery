import { type Notification } from '../schema';

export async function markNotificationRead(notificationId: number): Promise<Notification> {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this handler is marking a specific notification as read in the database.
    return Promise.resolve({
        id: notificationId,
        user_id: 0,
        type: 'ride_update' as const,
        title: 'Placeholder Title',
        message: 'Placeholder Message',
        is_read: true,
        created_at: new Date()
    } as Notification);
}