import { io } from 'socket.io-client';
import dotenv from 'dotenv';


//
dotenv.config();

const socket = io('http://localhost:' + (process.env.PORT || 4400));

//
const runGetRequest = (data: any) => {
  console.log('request: ' + JSON.stringify(data, null, 2))
  socket.emit('example:get', 
  data, 
  (res: any) => {
    console.log('response: ' + JSON.stringify(res, null, 2))
  })

}

const runExampleRequests = () => {
  runGetRequest({ exampleValue: -1 });
  runGetRequest({ exampleValue: 3 });
  runGetRequest({ exampleValue: 2 });
}


export default runExampleRequests;
