import { UploadImage } from "@/cloudinary/cloudUpload";
import { getCollection } from "@/lib/mongoClient";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import cloudinary from "@/cloudinary/cloudConfig";


export async function POST(req) {
    try {
        const formData = await req.formData();

        const username = formData.get("username");
        const email = formData.get("email");
        const password = formData.get("password");
        const imageFile = formData.get("image");

        if (!username || !email || !password) {
            return NextResponse.json(
                { message: "সব ফিল্ড প্রয়োজন" },
                { status: 400 }
            );
        }

        const collection = await getCollection("riders");

        const exitUser = await collection.findOne({ email });
        if (exitUser) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 400 }
            );
        }

        let imageUrl = null;
        let imageId = null;

        if (imageFile) {
            const uploaded = await UploadImage(imageFile);
            imageUrl = uploaded.secure_url;
            imageId = uploaded.public_id;
        }

        // const hashed = await bcrypt.hash(password, 10);

        await collection.insertOne({
            username,
            email,
            password,
            image: imageUrl,
            imageId,
            createdAt: new Date(),
        });

        return NextResponse.json(
            { success: true },
            { status: 201 }
        );

    } catch (error) {
        console.error("Rider POST error:", error);
        return NextResponse.json(
            { message: "সার্ভার এরর" },
            { status: 500 }
        );
    }
}



export async function GET() {
    try {
        const collection = await getCollection("riders");

        const riders = await collection
            .find(
                {},
                {
                    projection: {
                        username: 1,
                        email: 1,
                        password: 1,
                        image: 1,
                        createdAt: 1,
                    },
                }
            )
            .sort({ createdAt: -1 })
            .toArray();

        return NextResponse.json(
            { success: true, riders },
            { status: 200 }
        );

    } catch (error) {
        console.error("Rider GET error:", error);
        return NextResponse.json(
            { message: "Failed to fetch riders" },
            { status: 500 }
        );
    }
}

export async function DELETE(req) {
    try {
        const { deleteId, imageId } = await req.json();

        if (!deleteId) {
            return NextResponse.json(
                { message: "ID missing" },
                { status: 400 }
            );
        }

        if (imageId) {
            await cloudinary.uploader.destroy(imageId);
        }

        const collection = await getCollection("riders");
        await collection.deleteOne({ _id: new ObjectId(deleteId) });

        return NextResponse.json(
            { success: true },
            { status: 200 }
        );

    } catch (error) {
        console.error("Rider DELETE error:", error);
        return NextResponse.json(
            { message: "Delete failed" },
            { status: 500 }
        );
    }
}