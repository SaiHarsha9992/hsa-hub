import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

// We still define the collection name here
const COLLECTION_NAME = 'campaigns';

// GET: To fetch all campaigns
export async function GET() {
  try {
    const client = await clientPromise;
    // UPDATED: client.db() with no arguments uses the DB from your MONGODB_URI
    const db = client.db(); 

    const campaigns = await db.collection(COLLECTION_NAME).find({}).toArray();
    return NextResponse.json(campaigns);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error fetching campaigns' }, { status: 500 });
  }
}

// POST: To create a new campaign
export async function POST(request) {
  try {
    const client = await clientPromise;
    // UPDATED: client.db() with no arguments uses the DB from your MONGODB_URI
    const db = client.db();
    const newCampaign = await request.json();

    if (!newCampaign.campaignID) {
      newCampaign.campaignID = `CMP${Date.now()}`;
    }

    const result = await db.collection(COLLECTION_NAME).insertOne(newCampaign);
    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error creating campaign' }, { status: 500 });
  }
}