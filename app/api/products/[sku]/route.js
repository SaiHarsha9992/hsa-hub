import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

const COLLECTION_NAME = "products";

export async function GET(request, context) {
  try {
    const { sku } = await context.params;
    const client = await clientPromise;
    const db = client.db();

    const product = await db.collection(COLLECTION_NAME).findOne({ sku });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (e) {
    console.error("Error fetching product:", e);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

// ✅ PUT: Update product by SKU
export async function PUT(request, context) {
  try {
    const params = await context.params; // 🔥 FIX
    const sku = decodeURIComponent(params.sku);

    const client = await clientPromise;
    const db = client.db();

    const updatedData = await request.json();
    delete updatedData._id; // prevent _id overwrite

    const result = await db.collection(COLLECTION_NAME).updateOne(
      { sku },
      { $set: updatedData }
    );

    return NextResponse.json(result);
  } catch (e) {
    console.error("Error updating product:", e);
    return NextResponse.json(
      { error: "Error updating product" },
      { status: 500 }
    );
  }
}

// ✅ DELETE: Delete product by SKU
export async function DELETE(request, context) {
  try {
    const params = await context.params; // 🔥 FIX
    const sku = decodeURIComponent(params.sku);

    console.log("Deleting product identifier:", sku);

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection(COLLECTION_NAME).deleteOne({ sku });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount,
    });
  } catch (e) {
    console.error("Error deleting product:", e);
    return NextResponse.json(
      { error: "Error deleting product" },
      { status: 500 }
    );
  }
}
