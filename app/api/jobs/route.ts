import { NextResponse } from 'next/server'; import { connectDb } from '@/lib/db'; import { Job } from '@/models/Job';
export async function GET(){await connectDb();const jobs=await Job.find({status:'published',$or:[{deadline:null},{deadline:{$gte:new Date()}}]}).sort({featured:-1,postedDate:-1}).lean();return NextResponse.json(jobs)}

