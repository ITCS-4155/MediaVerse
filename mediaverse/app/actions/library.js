"use server";

import prisma from "../../lib/prisma";

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