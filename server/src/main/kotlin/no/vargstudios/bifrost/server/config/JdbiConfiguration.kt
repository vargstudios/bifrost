package no.vargstudios.bifrost.server.config

import no.vargstudios.bifrost.server.db.*
import org.jdbi.v3.core.Jdbi
import org.jdbi.v3.core.kotlin.KotlinPlugin
import org.jdbi.v3.sqlobject.kotlin.KotlinSqlObjectPlugin
import org.jdbi.v3.sqlobject.kotlin.onDemand
import javax.enterprise.context.ApplicationScoped
import javax.enterprise.context.Dependent
import javax.enterprise.inject.Produces
import javax.sql.DataSource

@Dependent
class JdbiConfiguration {

    @Produces
    @ApplicationScoped
    fun jdbi(dataSource: DataSource): Jdbi {
        return Jdbi.create(dataSource)
            .installPlugin(KotlinPlugin())
            .installPlugin(KotlinSqlObjectPlugin())
    }

    @Produces
    @ApplicationScoped
    fun elementCategoryDao(jdbi: Jdbi): ElementCategoryDao {
        return jdbi.onDemand()
    }

    @Produces
    @ApplicationScoped
    fun elementDao(jdbi: Jdbi): ElementDao {
        return jdbi.onDemand()
    }

    @Produces
    @ApplicationScoped
    fun elementVersionDao(jdbi: Jdbi): ElementVersionDao {
        return jdbi.onDemand()
    }

    @Produces
    @ApplicationScoped
    fun elementFrameDao(jdbi: Jdbi): ElementFrameDao {
        return jdbi.onDemand()
    }

}
