import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/Axios'
import * as https from 'https'
import { firstValueFrom  } from 'rxjs';

@Injectable()
export class SocketService { 

    constructor( private axios: HttpService) {}

   getHello(): string {
    return 'Hello World!';
  }

    saludar(user: string): string {
        return 'Hello '+user;
    }

  async gpsTren(id: string): Promise<any>{
    const result = await this.axios.get('https://am.transnet.cu/trenes/1.0/getPositionByDevice', {
      headers: {
       "Content-Type": "application/json",
       "apikey": "eyJ4NXQiOiJOVGRtWmpNNFpEazNOalkwWXpjNU1tWm1PRGd3TVRFM01XWXdOREU1TVdSbFpEZzROemM0WkE9PSIsImtpZCI6ImdhdGV3YXlfY2VydGlmaWNhdGVfYWxpYXMiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJhZG1pbkBjYXJib24uc3VwZXIiLCJhcHBsaWNhdGlvbiI6eyJvd25lciI6ImFkbWluIiwidGllclF1b3RhVHlwZSI6bnVsbCwidGllciI6IjEwUGVyTWluIiwibmFtZSI6IlRyZW5BbW9uaWFjbyIsImlkIjoxMiwidXVpZCI6IjNjMjEzNTg0LTVhNTMtNGRmYy05NmQ5LTUzZTMzMTZjOTY2NSJ9LCJpc3MiOiJodHRwczpcL1wvYXBpbS50cmFuc25ldC5jdTo0NDNcL29hdXRoMlwvdG9rZW4iLCJ0aWVySW5mbyI6eyJVbmxpbWl0ZWQiOnsidGllclF1b3RhVHlwZSI6InJlcXVlc3RDb3VudCIsImdyYXBoUUxNYXhDb21wbGV4aXR5IjowLCJncmFwaFFMTWF4RGVwdGgiOjAsInN0b3BPblF1b3RhUmVhY2giOnRydWUsInNwaWtlQXJyZXN0TGltaXQiOjAsInNwaWtlQXJyZXN0VW5pdCI6bnVsbH19LCJrZXl0eXBlIjoiUFJPRFVDVElPTiIsInBlcm1pdHRlZFJlZmVyZXIiOiIiLCJzdWJzY3JpYmVkQVBJcyI6W3sic3Vic2NyaWJlclRlbmFudERvbWFpbiI6ImNhcmJvbi5zdXBlciIsIm5hbWUiOiJUcmVuZXMiLCJjb250ZXh0IjoiXC90cmVuZXNcLzEuMCIsInB1Ymxpc2hlciI6ImFkbWluIiwidmVyc2lvbiI6IjEuMCIsInN1YnNjcmlwdGlvblRpZXIiOiJVbmxpbWl0ZWQifV0sInBlcm1pdHRlZElQIjoiIiwiaWF0IjoxNjIyNzQyNDUxLCJqdGkiOiI0MjJjZDgxMS1jMDNiLTRkNDctODZmMi1kNTc4YThkNWRmMmQifQ==.QqOm5tZOCbiSylLylsGmF4uZptRAkL0A-eUwyiwKgfwxpoUz_fmyujG90lePuHy1zDiasLnwGdaKUTu8PGUgBl_mkfhZjADS8UJXGpRcSH1OiW-9_Gn2fZHGeBJuDAANm-_1U8vltPXq0PkqNyjMIwn4s1wInZ6YIjfhFNqC3jk3vJo4PAeu_5qk--SZxHMfs5fhKxYK6nQwZDrvex0QvFDPw3pCBqW6C-lWVzp2mg6kuX-HUEjUtDPSWCxEEGpVg_NRCINQA1QAq9d7e9g4dByAefAgWHEWmrLqVvOC5vgyPu2hQhjbwUHVlyYVfK_R3fy34MhdQLI9McS6jPLLwQ=="
       },
      params: {
       device: id
    },
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
   });
    const respuesta = await firstValueFrom (result);   
    return respuesta.data;
  }  

}
