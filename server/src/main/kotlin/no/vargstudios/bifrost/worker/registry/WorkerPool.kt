package no.vargstudios.bifrost.worker.registry

import no.vargstudios.bifrost.server.api.model.Worker
import no.vargstudios.bifrost.server.api.model.WorkerState
import no.vargstudios.bifrost.server.api.model.WorkerState.*
import no.vargstudios.bifrost.worker.api.PingApi
import no.vargstudios.bifrost.worker.api.TranscodeApi
import org.eclipse.microprofile.rest.client.RestClientBuilder
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.lang.Thread.sleep
import java.net.URL
import java.util.*
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.ConcurrentLinkedQueue
import java.util.concurrent.ConcurrentMap
import java.util.concurrent.TimeUnit.SECONDS
import javax.enterprise.context.ApplicationScoped
import kotlin.concurrent.thread

@ApplicationScoped
class WorkerPool {

    private val logger: Logger = LoggerFactory.getLogger(this::class.java)

    private val tasks: Queue<(WorkerApis) -> Unit> = ConcurrentLinkedQueue<(WorkerApis) -> Unit>()
    private val workers: ConcurrentMap<String, WorkerState> = ConcurrentHashMap<String, WorkerState>()

    fun list(): List<Worker> {
        return workers.map { (url, state) ->
            Worker(url = url, state = state)
        }
    }

    fun isIdle(): Boolean {
        return tasks.isEmpty() && workers.none { (_, state) -> state == BUSY }
    }

    fun addTask(task: (WorkerApis) -> Unit) {
        tasks.add(task)
    }

    fun addWorker(url: String) {
        // Add worker state. Stop if worker already exists.
        if (workers.putIfAbsent(url, NEW) != null) {
            return
        }

        // Create worker
        val worker = WorkerApis(
            url = url,
            pingApi = RestClientBuilder.newBuilder()
                .baseUrl(URL(url))
                .connectTimeout(3, SECONDS)
                .readTimeout(3, SECONDS)
                .build(PingApi::class.java),
            transcodeApi = RestClientBuilder.newBuilder()
                .baseUrl(URL(url))
                .connectTimeout(3, SECONDS)
                .readTimeout(30, SECONDS)
                .build(TranscodeApi::class.java)
        )

        // Start worker thread
        thread {
            while (true) {
                // Unreachable until ping ok
                try {
                    worker.pingApi.ping()
                } catch (e: Exception) {
                    workers[url] = UNREACHABLE
                    sleep(10_000)
                    continue
                }

                while (true) {
                    // Idle until there are tasks
                    val task = tasks.poll()
                    if (task == null) {
                        workers[url] = IDLE
                        sleep(10_000)
                        break
                    }

                    // Busy while there are tasks
                    try {
                        workers[url] = BUSY
                        task(worker)
                    } catch (e: Exception) {
                        logger.error("Worker $url failed", e)
                        sleep(10_000)
                        break
                    }
                }
            }
        }
    }

}
