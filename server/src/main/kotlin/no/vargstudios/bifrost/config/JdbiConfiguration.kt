package no.vargstudios.bifrost.config

import no.vargstudios.bifrost.db.ElementCategoryDao
import no.vargstudios.bifrost.db.ElementDao
import no.vargstudios.bifrost.db.ElementVersionDao
import no.vargstudios.bifrost.db.TagDao
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
    fun tagDao(jdbi: Jdbi): TagDao {
        return jdbi.onDemand()
    }

}