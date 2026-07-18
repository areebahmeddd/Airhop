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

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat
import org.onemindlabs.airhop.MainActivity

private const val CHANNEL_ID      = "airhop_mesh_bg"
private const val NOTIFICATION_ID = 1001

class AirhopForegroundService : Service() {

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
        startForeground(NOTIFICATION_ID, buildNotification())
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        // Restart automatically if the system kills the service
        return START_STICKY
    }

    override fun onDestroy() {
        stopForeground(STOP_FOREGROUND_REMOVE)
        super.onDestroy()
    }

    // MARK: - Notification

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Mesh Network",
                NotificationManager.IMPORTANCE_LOW, // silent but persistent
            ).apply {
                description = "Keeps Airhop mesh active in the background"
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

        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Airhop mesh active")
            .setContentText("Discovering and relaying nearby messages")
            .setSmallIcon(android.R.drawable.ic_menu_share) // replaced by app icon at build time
            .setOngoing(true)
            .setSilent(true)
            .setContentIntent(pendingIntent)
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
