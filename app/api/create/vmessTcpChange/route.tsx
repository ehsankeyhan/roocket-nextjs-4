import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  const listUrl = 'http://irb.giftomo.net:44445/xui/inbound/list';
  const addUrl = 'http://irb.giftomo.net:44445/xui/inbound/add';
  const paramsData = await req.json();
  
  if (!paramsData.newAccount.enable) {
    return NextResponse.json({
      error: 'Account not enabled, we can’t change this',
    });
  }

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
  const selectedCookie = cookies['irbh'];

  if (!selectedCookie) {
    return NextResponse.json({
      error: 'Cookie not found for the specified ID',
    });
  }

  const headers = {
    'Cookie': selectedCookie,
  };

  try {
    // Step 1: Get the existing inbound list
    const listResponse = await axios.post(listUrl, {}, { headers });
    const inbounds = listResponse.data.obj;

    // Step 2: Find the latest remark and increment it
    const lastInbound = inbounds[inbounds.length - 1];
    const lastRemark = lastInbound ? lastInbound.remark : 'irb000';
    const lastRemarkNumber = parseInt(lastRemark.replace('irb', ''), 10);
    const newRemark = `irb${String(lastRemarkNumber + 1).padStart(3, '0')}`;
    const newPort = parseInt(lastInbound.port) + 1;

    // Step 3: Generate a new UUID for the client ID
    const newClientId = uuidv4();

    // Step 4: Define the parameters for the new inbound request
    const params = {
      up: paramsData.newAccount.up,
      down: paramsData.newAccount.down,
      total: paramsData.newAccount.total,
      remark: newRemark,
      enable: 'true',
      expiryTime: paramsData.newAccount.expiryTime.toString(),
      listen: '',
      port: newPort.toString(),
      protocol: 'vmess',
      settings: JSON.stringify({
        clients: [
          {
            id: JSON.parse(paramsData.newAccount.settings).clients[0].id.split('-')[0] + '-' + newClientId.split('-').slice(1).join('-'),
            alterId: 0,
          },
        ],
        disableInsecureEncryption: false,
      }),
      streamSettings: JSON.stringify({
        network: 'tcp',
        security: 'none',
        tcpSettings: {
          header: {
            type: 'none',
          },
        },
      }),
      sniffing: JSON.stringify({
        enabled: true,
        destOverride: ['http', 'tls'],
      }),
    };

    const body = new URLSearchParams(params).toString();

    // Step 5: Add the new inbound configuration
    const addResponse = await axios.post(addUrl, body, { headers });

    // Step 6: Call the list API again to get the updated inbound list
    const updatedListResponse = await axios.post(listUrl, {}, { headers });
    const updatedInbounds = updatedListResponse.data.obj;

    // Extract the new remark from the updated inbounds
    const newAccount = updatedInbounds.find((inbound: any) => inbound.remark === newRemark);

    // Step 7: Call the update API with the modified paramsData
    const updateResponse = await axios.post('http://localhost:3001/api/delete', {
      ...paramsData,
      newAccount: {
        ...paramsData.newAccount,
        enable: false, // Update enable to false
      },
    });

    return NextResponse.json({
      message: 'Inbound configuration added successfully',
      newRemark,
      response: addResponse.data,
      newAccount, // Include the newly created inbound object
      updateResponse: updateResponse.data, // Include the response from the update API
    });
  } catch (error: any) {
    return NextResponse.json({
      error: 'Error making request',
      details: error.message || error.toString(),
    });
  }
}
