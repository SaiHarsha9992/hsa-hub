import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

const DB_NAME = "retail-hub";
const COLLECTION_NAME = "campaigns";

export async function PUT(req, context) {
  try {
    const params = await context.params; // ✅ await here
    const { campaignID } = params;
    console.log("Updating campaignID:", campaignID);

    const campaignIDClean = campaignID.trim();

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const updatedData = await req.json();
    delete updatedData._id;

    const existing = await db.collection(COLLECTION_NAME).findOne({ campaignID: campaignIDClean });
    if (!existing) {
      console.log("No document matched campaignID:", campaignIDClean);
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    const result = await db.collection(COLLECTION_NAME).updateOne(
      { campaignID: campaignIDClean }, // ✅ fixed
      { $set: updatedData }
    );

    return NextResponse.json({ success: true, result });
  } catch (e) {
    console.error("❌ Error updating campaign:", e);
    return NextResponse.json({ error: "Error updating campaign" }, { status: 500 });
  }
}
