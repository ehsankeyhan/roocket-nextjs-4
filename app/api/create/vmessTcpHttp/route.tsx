import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  // Get and validate search params
  const searchParams = req.nextUrl.searchParams;
  const expireTime = searchParams.get('expire');
  const gigabytes = searchParams.get('gigs');
  const userId = searchParams.get('userId');

  // Check if required parameters are provided
  if (!expireTime || !gigabytes) {
    return NextResponse.json({
      error: 'Invalid request',
      details: 'Both expire and gigs parameters are required'
    }, { status: 400 });
  }

  // Parse parameters after validation
  const expireMinutes = parseInt(expireTime);
  const gigabytesValue = parseInt(gigabytes);

  const serverList = [
    'irnh', 'iroh', 'iruh',
    'irsh', 'irph', 'irah',
    'irth', 'ireh'
  ];
  let selectedServer = '';
  let minEnabledAccounts = Infinity;
  let selectedInbounds: any[] = [];

  // Read the cookie.csv file from the public folder
  const filePath = path.join(process.cwd(), 'public', 'cookie.csv');
  let cookies: Record<string, string> = {};

  try {
    const data = fs.readFileSync(filePath, 'utf8');
    // Parse the CSV data
    const lines = data.split('\n');
    for (const line of lines.slice(1)) {
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

  // Check each server for enabled accounts
  for (const server of serverList) {
    const cookie = cookies[server];
    if (!cookie) continue;

    const listUrl = `http://${server}.giftomo.net:44445/xui/inbound/list`;
    try {
      const listResponse = await axios.post(listUrl, {}, { 
        headers: { 'Cookie': cookie }
      });
      
      const inbounds = listResponse.data.obj;
      const enabledCount = inbounds.filter((inbound: any) => inbound.enable).length;
      
      if (enabledCount < minEnabledAccounts) {
        minEnabledAccounts = enabledCount;
        selectedServer = server;
        selectedInbounds = inbounds;
      }
    } catch (error) {
      console.error(`Error checking server ${server}:`, error);
      continue;
    }
  }

  if (!selectedServer) {
    return NextResponse.json({
      error: 'No available server found',
    });
  }

  const listUrl = `http://${selectedServer}.giftomo.net:44445/xui/inbound/list`;
  const addUrl = `http://${selectedServer}.giftomo.net:44445/xui/inbound/add`;
  const selectedCookie = cookies[selectedServer];

  const headers = {
    'Cookie': selectedCookie,
  };

  try {
    // Use selectedInbounds instead of making another request
    const inbounds = selectedInbounds;

    // Step 2: Find the latest remark and increment it
    const lastInbound = inbounds[inbounds.length - 1];
    const serverPrefix = selectedServer.slice(0, 3); // Get first 3 chars of server name (e.g., 'ire' from 'ireh')
    const lastRemark = lastInbound ? lastInbound.remark : `${serverPrefix}000`;
    const lastRemarkNumber = parseInt(lastRemark.replace(serverPrefix, ''), 10);
    const newRemark = `${serverPrefix}${String(lastRemarkNumber + 1).padStart(3, '0')}`;
    const newPort = parseInt(lastInbound.port) + 1;

    // Step 3: Generate a new UUID for the client ID
    // Change: Prefix the UUID with userId if provided
    let newClientId = uuidv4();
    if (userId) {
      newClientId = `${userId}-${uuidv4().split('-').slice(1).join('-')}`;
    }

    // Step 4: Define the parameters for the new inbound request
    const params:any = {
      up: '0',
      down: '0',
      total: gigabytesValue, // Use validated gigabytes
      remark: newRemark,
      enable: 'true',
      expiryTime: expireMinutes, // Use validated expire time
      listen: '',
      port: newPort.toString(),
      protocol: 'vmess',
      settings: JSON.stringify({
        clients: [
          {
            id: newClientId,
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
            type: 'http',
            request: {
              method: 'GET',
              path: ['/'],
              headers: {
                Host: ['uptvs.com']
              }
            },
            response: {
              version: '1.1',
              status: '200',
              reason: 'OK',
              headers: {}
            }
          }
        }
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

    // Format the account settings
    if (newAccount) {
      newAccount.settings = JSON.parse(newAccount.settings);
      newAccount.streamSettings = JSON.parse(newAccount.streamSettings);
      newAccount.sniffing = JSON.parse(newAccount.sniffing);
    }

    return NextResponse.json({
      message: 'Inbound configuration added successfully',
      newRemark,
      server: `${selectedServer}.giftomo.net`,
      tunnel: `${serverPrefix}.giftomo.net`,
      response: {
        success: addResponse?.data?.success || false,
        msg: addResponse?.data?.msg || '',
        obj: addResponse?.data?.obj || null
      },
      newAccount
    });
  } catch (error: any) {
    return NextResponse.json({
      error: 'Error making request',
      details: error.message || error.toString(),
    });
  }
}




