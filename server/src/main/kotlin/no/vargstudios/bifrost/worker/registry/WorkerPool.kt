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
import java.util.concurrent.TimeUnit.SECONDS
import javax.enterprise.context.ApplicationScoped
import kotlin.concurrent.thread

@ApplicationScoped
class WorkerPool {

    private val logger: Logger = LoggerFactory.getLogger(this::class.java)

    private val tasks: Queue<WorkerTask> = LinkedList()
    private val workersById: MutableMap<String, Worker> = HashMap()

    fun listWorkers(): List<Worker> {
        synchronized(this) {
            return workersById.values.toList()
        }
    }

    fun getWorker(id: String): Worker? {
        synchronized(this) {
            return workersById[id]
        }
    }

    fun updateWorker(id: String, func: (Worker) -> Worker) {
        synchronized(this) {
            workersById.computeIfPresent(id) { _, worker -> func(worker) }
        }
    }

    fun isIdle(): Boolean {
        synchronized(this) {
            return tasks.isEmpty() && workersById.values.none { it.state == WORKING }
        }
    }

    fun addTask(workerTask: WorkerTask) {
        synchronized(this) {
            tasks.add(workerTask)
        }
    }

    fun addWorker(worker: Worker) {
        synchronized(this) {
            if (workersById.values.any { it.url == worker.url }) {
                return
            }
            workersById[worker.id] = worker
        }
        logger.info("Starting $worker")
        startWorker(worker.id, worker.url)
    }

    private fun nextTask(): WorkerTask? {
        synchronized(this) {
            return tasks.poll()
        }
    }

    private fun startWorker(id: String, url: String) {
        // Create worker apis
        val apis = WorkerApis(
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

        // Simplified state update function
        val setState = { state: WorkerState ->
            updateWorker(id) { worker -> worker.copy(state = state) }
        }

        // Start worker thread
        thread {
            while (true) {
                // Wait between attempts
                sleep(3_000)

                // Unreachable until ping ok
                try {
                    apis.pingApi.ping()
                } catch (e: Exception) {
                    setState(UNREACHABLE)
                    continue
                }

                while (true) {
                    // Idle until enabled
                    val worker = getWorker(id)!!
                    if (!worker.enabled) {
                        setState(IDLE)
                        break
                    }

                    // Idle until there are tasks
                    val task = nextTask()
                    if (task == null) {
                        setState(IDLE)
                        break
                    }

                    // Working while there are tasks
                    try {
                        setState(WORKING)
                        task(worker, apis)
                    } catch (e: Exception) {
                        logger.error("Worker $id @ $url failed", e)
                        break
                    }
                }
            }
        }
    }
}
