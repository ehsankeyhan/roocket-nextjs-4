import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  try {
    // Array to hold the extracted session cookie values and corresponding IDs
    const sessionCookies:any = [];
    const ids:any = [];

    // URLs of the APIs
    const apiUrls = [
      'http://irnh.giftomo.net:44445/login',
      'http://iroh.giftomo.net:44445/login',
      'http://irkh.giftomo.net:44445/login',
      'http://irmh.giftomo.net:44445/login',
      'http://irph.giftomo.net:44445/login',
      'http://irsh.giftomo.net:44445/login',
      'http://iruh.giftomo.net:44445/login',
      'http://irwh.giftomo.net:44445/login',
      'http://irxh.giftomo.net:44445/login',
      'http://iryh.giftomo.net:44445/login',
      'http://irzh.giftomo.net:44445/login',
      'http://irth.giftomo.net:44445/login',
      'http://ireh.giftomo.net:44445/login',
      'http://irvh.giftomo.net:44445/login',
      'http://irah.giftomo.net:44445/login',

    ];

    // Make asynchronous requests to all APIs in parallel
    await Promise.all(
      apiUrls.map(async (apiUrl) => {
        const response:any = await axios.post(apiUrl, {
          username: 'ehsan',
          password: '019313276'
        });        
        // Get the Set-Cookie header value from the response
        const setCookieValue = response.headers['set-cookie'][0];
        console.log(setCookieValue);


        // Extract the session cookie value using regex
        const sessionCookie = setCookieValue.match(/session=[^;]*/)[0];

        // Parse the URL to extract the ID
        const parsedUrl = new URL(apiUrl);
        const id = parsedUrl.hostname.split('.')[0]; // Extract the subdomain as the ID
        console.log(setCookieValue);
        console.log(id);


        // Add the extracted session cookie value and ID to their respective arrays
        sessionCookies.push(sessionCookie);
        ids.push(id);
      })
    );

    // Save the data to a CSV file
    const csvContent = 'ID,SessionCookie\n' + ids.map((id:any, index:any) => `${id},${sessionCookies[index]}`).join('\n');
    const filePath = path.join(process.cwd(), 'public', 'cookie.csv');
    fs.writeFileSync(filePath, csvContent);

    // Send all the extracted session cookie values and IDs as the API response
    return NextResponse.json({ ids, sessionCookies });
  } catch (error:any) {
    console.error('Error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
