package com.wisdomrider.socketio;

import android.app.Service;
import android.content.Intent;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.util.Log;
import android.widget.Toast;
import io.socket.client.IO;
import io.socket.client.Socket;
import io.socket.emitter.Emitter;

import java.net.URISyntaxException;

public class SocketService extends Service {
    Socket socket;

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        IO.Options options = new IO.Options();
        options.query = "Auth=" + "token;pass";
        try {
            socket = IO.socket(Constants.SOCKET_URL, options);
        } catch (URISyntaxException e) {
            Log.e("SERVER_CRASHED", e.getMessage());
        }
        setupListerners();
        socket.connect();

        return START_NOT_STICKY;
    }





    private void setupListerners() {
      socket.on(Socket.EVENT_CONNECT, new Emitter.Listener() {
          @Override
          public void call(Object... args) {
              Log.e("Connected","YES");
          }
      }).on(Socket.EVENT_DISCONNECT, new Emitter.Listener() {
          @Override
          public void call(Object... args)
          {
            Log.e("Disconnected","Yes");
          }
      }).on(Socket.EVENT_CONNECT_ERROR, new Emitter.Listener() {
          @Override
          public void call(Object... args) {
              Log.e("SOCKET.IO","Connection_Error");

          }
      }).on(Constants.HAMRO_DRIVER_SERVER, new Emitter.Listener() {
          @Override
          public void call(Object... args) {
              Response(args[0].toString(),Constants.HAMRO_DRIVER_SERVER);
          }
      }).on(Constants.AUTHENTICATED, new Emitter.Listener() {
          @Override
          public void call(Object... args) {
              Response(args[0].toString(),Constants.AUTHENTICATED);
          }
      }).on(Constants.AUTHENTICATION_FAILED, new Emitter.Listener() {
          @Override
          public void call(Object... args) {
              Log.e("SOCKET.IO","UNABLE TO CONNECT AUTH ERROR");
          }
      });
    }

    private void Response(final String message, String TAG) {
        Handler handler=new Handler(Looper.getMainLooper());
        handler.post(new Runnable() {
            @Override
            public void run() {
                Toast.makeText(SocketService.this, message, Toast.LENGTH_SHORT).show();
            }
        });
    }


}
