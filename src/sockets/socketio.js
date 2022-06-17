import { Server } from "socket.io";

export function launchSocketserver (server){

//Server is a class  object coming from socket.io module or library 

    const io = new Server(server);

// io.of('/trialroute').on('connection', (socket) => {
//     socket.on('conn',data => {
//       console.log("DATA:", data.notifications[0].location.district)})
//       } )

    io.sockets.on('connection', function (socket) {
        
            socket.emit('LISTEN', "My Name Is DASHANAN!")
            //here after
            socket.on('ALARMNOTIFICATION', async function (data) {
            try {
                const parseObj = JSON.parse(data);
                console.log(parseObj)
                // switch (parseObj.notifications[0].uri) {
                //     case '/notification/relevantflag':
                //     console.log("DATAONE",data);
                //     break;
                //     case '/notification/readflag':            
                //     console.log("My name is Dashanan");
                //     break; 
                //     default:
                //     break;
                // }
            } catch (err) {
                console.log(err);
            }
            });
        }
        );
}

