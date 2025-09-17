import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

const COLLECTION_NAME = 'products';

// GET: To fetch all products
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(); // Uses the DB from your MONGODB_URI

    const products = await db.collection(COLLECTION_NAME).find({}).toArray();
    return NextResponse.json(products);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error fetching products' }, { status: 500 });
  }
}

// POST: To create a new product
export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const newProduct = await request.json();

    const result = await db.collection(COLLECTION_NAME).insertOne(newProduct);
    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error creating product' }, { status: 500 });
  }
}