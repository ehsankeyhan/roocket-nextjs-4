import axios from 'axios';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ remark: string }> }
){
  const { remark }:any = await params; // Directly extract remark from URL params

  // Construct the URL based on the remark
  const url = `http://${remark.substring(0, 3)}h.giftomo.net:44445/xui/inbound/list`;

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
    return Response.json({
      error: 'Error reading cookie.csv',
      details: error.message,
    });
  }

  // Use the desired cookie ID based on remark logic
  const selectedCookie = cookies[`${remark.substring(0, 3)}h`];

  if (!selectedCookie) {
    return Response.json({
      error: 'Cookie not found for the specified ID',
    });
  }

  const headers = {
    'Cookie': selectedCookie,
  };

  try {
    // Send POST request to the constructed URL
    const response = await axios.post(url, {}, { headers });

    if (response.data.obj && Array.isArray(response.data.obj) && response.data.obj.length > 0) {
      const newAccount = response.data.obj.find((inbound: any) => inbound.remark === remark);
      
      if (newAccount) {
        const filteredAccount = {
          up: newAccount.up,
          down: newAccount.down,
          total: newAccount.total,
          remark: newAccount.remark,
          enable: newAccount.enable,
          expiryTime: newAccount.expiryTime,
        };
        return Response.json(filteredAccount);
      }
      
      return Response.json({
        error: 'Account not found',
      });
    } else {
      return Response.json({
        error: 'No valid data found in the response',
      });
    }
  } catch (error: any) {
    console.error('Error making request:', error);
    return Response.json({
      error: 'Error making request',
      details: error.message || error.toString(),
    });
  }
}
