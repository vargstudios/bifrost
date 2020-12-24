package no.vargstudios.bifrost.db

import no.vargstudios.bifrost.db.model.ElementRow
import org.jdbi.v3.sqlobject.statement.SqlQuery
import org.jdbi.v3.sqlobject.statement.SqlUpdate

interface ElementDao {

    @SqlUpdate("""
        insert into elements (id, category_id, name, framecount, framerate, alpha, created)
        values (:element.id, :element.categoryId, :element.name, :element.framecount, :element.framerate, :element.alpha, :element.created)
        """)
    fun insert(element: ElementRow)

    @SqlQuery("select * from elements")
    fun list(): List<ElementRow>

    @SqlQuery("select * from elements where id = :id")
    fun get(id: String): ElementRow?

}
