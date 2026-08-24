// AirhopForegroundService: keeps the BLE mesh alive when the app is backgrounded.
//
// Android aggressively terminates background processes to save battery. A
// foreground service with a persistent notification is the only reliable way to
// keep BluetoothLeScanner and BluetoothGattServer active while the app is not
// in the foreground.
//
// The service itself is intentionally thin - it only manages the notification
// and the service lifecycle. BLE logic remains in AirhopBLEModule.
package org.onemindlabs.airhop.service

import android.app.ForegroundServiceStartNotAllowedException
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.pm.ServiceInfo
import android.os.Build
import android.os.IBinder
import android.util.Log
import androidx.core.app.NotificationCompat
import androidx.core.app.ServiceCompat
import androidx.core.content.ContextCompat
import org.onemindlabs.airhop.MainActivity
import org.onemindlabs.airhop.R
import org.onemindlabs.airhop.ble.AirhopBLEModule

private const val TAG = "AirhopForegroundService"

private const val CHANNEL_ID      = "airhop_mesh_bg"
private const val NOTIFICATION_ID = 1001

// Sent by the notification's "Stop mesh" button.
private const val ACTION_STOP = "org.onemindlabs.airhop.action.STOP_MESH"

class AirhopForegroundService : Service() {

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
        promoteToForeground()
    }

    // Android 14 requires the service type to be passed here, not just declared
    // in the manifest, and it must be one the app currently holds a permission
    // for. ServiceCompat handles the version split.
    //
    // The catch is not defensive padding: startForegroundService() can succeed
    // and this call still throw a moment later, when the app has slipped into
    // the background in between (Android 12+) or lost the Bluetooth permission
    // the connectedDevice type is granted against. That throw would take the
    // whole app down for something that is only ever an optimisation - the mesh
    // runs fine in the foreground either way - so it is caught and the service
    // simply stands down.
    private fun promoteToForeground() {
        try {
            ServiceCompat.startForeground(
                this,
                NOTIFICATION_ID,
                buildNotification(),
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    ServiceInfo.FOREGROUND_SERVICE_TYPE_CONNECTED_DEVICE
                } else {
                    0
                },
            )
        } catch (e: Exception) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S &&
                e is ForegroundServiceStartNotAllowedException
            ) {
                Log.w(TAG, "Not allowed to start in the foreground right now")
            } else {
                Log.w(TAG, "Foreground promotion failed: ${e.message}")
            }
            stopSelf()
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        if (intent?.action == ACTION_STOP) {
            // Hand the shutdown to JS when there is a JS to hand it to, so the
            // mesh comes down the same way the in-app Status picker brings it
            // down (radios, relays, presence). Its stopAdvertising() call ends
            // up back here and stops this service - but we stop unconditionally
            // anyway: the notification has to disappear the moment it is
            // tapped, whether or not anything answered.
            AirhopBLEModule.requestMeshStop()
            ServiceCompat.stopForeground(this, ServiceCompat.STOP_FOREGROUND_REMOVE)
            stopSelf()
            return START_NOT_STICKY
        }
        // NOT_STICKY on purpose. This service is only useful as a companion to
        // the running JS runtime: it holds the process up so BLE and the relay
        // socket survive backgrounding. If the OS kills the process, letting
        // Android resurrect the service alone would put a "mesh active"
        // notification on screen with no mesh behind it - which is exactly the
        // state that leaves force-stop as the only way out.
        return START_NOT_STICKY
    }

    override fun onDestroy() {
        ServiceCompat.stopForeground(this, ServiceCompat.STOP_FOREGROUND_REMOVE)
        super.onDestroy()
    }

    // MARK: - Notification

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                getString(R.string.mesh_channel_name),
                NotificationManager.IMPORTANCE_LOW, // silent but persistent
            ).apply {
                description = getString(R.string.mesh_channel_description)
                setShowBadge(false)
            }
            val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            manager.createNotificationChannel(channel)
        }
    }

    private fun buildNotification(): Notification {
        val launchIntent = Intent(this, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_SINGLE_TOP
        }
        val pendingIntent = PendingIntent.getActivity(
            this, 0, launchIntent,
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )

        // An ongoing notification the user cannot dismiss needs a way out that
        // isn't force-stop. Without this the only exits are Settings or killing
        // the app, and neither is something a person should have to discover.
        val stopIntent = PendingIntent.getService(
            this, 1,
            Intent(this, AirhopForegroundService::class.java).setAction(ACTION_STOP),
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )

        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle(getString(R.string.mesh_notification_title))
            .setContentText(getString(R.string.mesh_notification_text))
            // The same drawable the manifest points expo-notifications at, so
            // the notice sitting in the shade all day and a notice about a
            // message are recognisably one app.
            .setSmallIcon(R.drawable.notification_icon)
            .setColor(ContextCompat.getColor(this, R.color.notification_icon_color))
            .setOngoing(true)
            .setSilent(true)
            .setContentIntent(pendingIntent)
            .addAction(0, getString(R.string.mesh_notification_stop), stopIntent)
            .build()
    }

    companion object {
        fun start(context: Context) {
            val intent = Intent(context, AirhopForegroundService::class.java)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                context.startForegroundService(intent)
            } else {
                context.startService(intent)
            }
        }

        fun stop(context: Context) {
            context.stopService(Intent(context, AirhopForegroundService::class.java))
        }
    }
}
