// app/api/inbound/update/route.js

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  // Check if the request is a POST method


  // Parse the incoming request body
  const paramsData = await req.json();

const url = `http://${paramsData.newAccount.remark.substring(0, 3)}.giftomo.net:44445/xui/inbound/update/${paramsData.newAccount.id}`;

  // Read the cookie.csv file from the public folder
  const filePath = path.join(process.cwd(), 'public', 'cookie.csv');

  let cookies: Record<string, string> = {};

  try {
    const data = fs.readFileSync(filePath, 'utf8');

    // Parse the CSV data
    const lines = data.split('\n');
    for (const line of lines.slice(1)) { // Skip header
      const [id, cookie] = line.split(',');
      if (id && cookie) {
        cookies[id.trim()] = cookie.trim();
      }
    }
  } catch (error: any) {
    return NextResponse.json({
      error: 'Error reading cookie.csv',
      details: error.message,
    });
  }

  // Use the desired cookie ID, e.g., 'irbh'
  const selectedCookie = cookies[`${paramsData.newAccount.remark.substring(0, 3)}h`]; // You might want to adjust the cookie ID based on your logic

  if (!selectedCookie) {
    return NextResponse.json({
      error: 'Cookie not found for the specified ID',
    });
  }

  const headers = {
    'Cookie': selectedCookie,
  };

  // Prepare the data in the same format as the curl command
  const params = new URLSearchParams({
    id:paramsData.newAccount.id,
    userId:'0',
    up:paramsData.newAccount.up,
    down:paramsData.newAccount.down,
    total:paramsData.newAccount.total,
    remark:paramsData.newAccount.remark,
    enable:paramsData.newAccount.enable,
    expiryTime:paramsData.newAccount.expiryTime,
    listen:paramsData.newAccount.listen,
    port:paramsData.newAccount.port,
    protocol:paramsData.newAccount.protocol,
    settings: paramsData.newAccount.settings,
    streamSettings: paramsData.newAccount.streamSettings,
    tag:paramsData.newAccount.tag,
    sniffing:paramsData.newAccount.sniffing,
  });


  console.log(params.toString());
  console.log(url);
  


  try {
    // Make the POST request
    const response = await axios.post(url, params.toString(), { headers });

    // Send the response back to the client
    return NextResponse.json(response.data, { status: response.status });
  } catch (error:any) {
    return NextResponse.json(
      {
        error: 'Error making request',
        details: error.response?.data || error.message || error.toString(),
      },
      { status: error.response?.status || 500 }
    );
  }
}
