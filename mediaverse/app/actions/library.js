"use server";

import prisma from "../../lib/prisma";

// ==========================================
// SAVE MEDIA (MASTER LIBRARY ONLY)
// ==========================================
export async function saveMedia(mediaData, userId) {
    try {
        const savedItem = await prisma.mediaItem.upsert({
            where: {
                userId_externalId: {
                    userId: userId,
                    externalId: mediaData.externalId,
                },
            },
            update: {},
            create: {
                title: mediaData.title,
                type: mediaData.type,
                description: mediaData.description,
                imageUrl: mediaData.imageUrl,
                releaseDate: mediaData.releaseDate ? new Date(mediaData.releaseDate) : null,
                externalId: mediaData.externalId,
                genres: mediaData.genres || [],
                creator: mediaData.creator,
                userId: userId,
            },
        });

        return { success: true, item: savedItem };
    } catch (error) {
        console.error("Error saving media to library:", error);
        return { error: "Failed to save media." };
    }
}

// ==========================================
// SAVE MEDIA TO A LIST
// ==========================================
export async function saveMediaToList(mediaData, listId, userId) {
    try {
        const savedItem = await prisma.mediaItem.upsert({
            where: {
                userId_externalId: {
                    userId: userId,
                    externalId: mediaData.externalId,
                },
            },
            update: {
                lists: {
                    connect: { id: listId }
                }
            },
            create: {
                title: mediaData.title,
                type: mediaData.type,
                description: mediaData.description,
                imageUrl: mediaData.imageUrl,
                releaseDate: mediaData.releaseDate ? new Date(mediaData.releaseDate) : null,
                externalId: mediaData.externalId,
                genres: mediaData.genres || [],
                creator: mediaData.creator,
                userId: userId,
                lists: {
                    connect: { id: listId }
                }
            },
        });

        return { success: true, item: savedItem };
    } catch (error) {
        console.error("Error saving media:", error);
        return { error: "Failed to save media item." };
    }
}

// ==========================================
// CREATE A NEW LIST
// ==========================================
export async function createCustomList(name, userId) {
    try {
        const newList = await prisma.list.create({
            data: {
                name: name,
                userId: userId,
            },
        });
        return { success: true, list: newList };
    } catch (error) {
        console.error("Error creating list:", error);
        return { error: "Failed to create list." };
    }
}

// ==========================================
// GET USER'S ENTIRE LIBRARY
// ==========================================
export async function getUserLibrary(userId) {
    try {
        const library = await prisma.mediaItem.findMany({
            where: { userId: userId },
            orderBy: { updatedAt: 'desc' },
            include: { lists: true }
        });
        return { success: true, data: library };
    } catch (error) {
        console.error("Error fetching library:", error);
        return { error: "Failed to load library." };
    }
}

// ==========================================
// GET USER'S CUSTOM LISTS
// ==========================================
export async function getUserLists(userId) {
    try {
        const lists = await prisma.list.findMany({
            where: { userId: userId },
            include: {
                _count: { select: { mediaItems: true } }
            }
        });
        return { success: true, data: lists };
    } catch (error) {
        console.error("Error fetching lists:", error);
        return { error: "Failed to load lists." };
    }
}

// ==========================================
// UPDATE RATING, REVIEW, OR STATUS
// ==========================================
export async function updateMediaEntry(mediaId, userId, updateData) {
    try {
        const updatedItem = await prisma.mediaItem.update({
            where: {
                id: mediaId,
                userId: userId
            },
            data: {
                status: updateData.status,
                rating: updateData.rating,
                review: updateData.review,
            }
        });
        return { success: true, data: updatedItem };
    } catch (error) {
        console.error("Error updating media:", error);
        return { error: "Failed to update item." };
    }
}

// ==========================================
// REMOVE MEDIA FROM A SPECIFIC LIST
// ==========================================
export async function removeMediaFromList(mediaId, listId, userId) {
    try {
        await prisma.list.update({
            where: { id: listId, userId: userId },
            data: {
                mediaItems: {
                    disconnect: { id: mediaId }
                }
            }
        });
        return { success: true };
    } catch (error) {
        console.error("Error removing item from list:", error);
        return { error: "Failed to remove item from list." };
    }
}

// ==========================================
// DELETE MEDIA COMPLETELY FROM ACCOUNT
// ==========================================
export async function deleteMediaItem(mediaId, userId) {
    try {
        await prisma.mediaItem.delete({
            where: { id: mediaId, userId: userId }
        });
        return { success: true };
    } catch (error) {
        console.error("Error deleting media item:", error);
        return { error: "Failed to delete item." };
    }
}

// ==========================================
// GET DETAILS & ITEMS OF A SPECIFIC LIST
// ==========================================
export async function getListDetails(listId, userId) {
    try {
        const list = await prisma.list.findFirst({
            where: {
                id: listId,
                userId: userId
            },
            include: {
                mediaItems: {
                    orderBy: { updatedAt: 'desc' }
                }
            }
        });
        if (!list) return { error: "List not found." };
        return { success: true, data: list };
    } catch (error) {
        console.error("Error fetching list details:", error);
        return { error: "Failed to load list details." };
    }
}

// ==========================================
// DELETE A CUSTOM LIST
// ==========================================
export async function deleteList(listId, userId) {
    try {
        await prisma.list.delete({
            where: {
                id: listId,
                userId: userId
            }
        });
        return { success: true };
    } catch (error) {
        console.error("Error deleting list:", error);
        return { error: "Failed to delete list." };
    }
}