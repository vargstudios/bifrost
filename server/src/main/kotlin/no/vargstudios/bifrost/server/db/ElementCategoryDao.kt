package no.vargstudios.bifrost.server.db

import no.vargstudios.bifrost.server.db.model.ElementCategoryRow
import org.jdbi.v3.sqlobject.statement.SqlQuery
import org.jdbi.v3.sqlobject.statement.SqlUpdate

interface ElementCategoryDao {

    @SqlUpdate(
        """
        insert into element_categories (id, name, created)
        values (:category.id, :category.name, :category.created)
        """
    )
    fun insert(category: ElementCategoryRow)

    @SqlQuery("select * from element_categories")
    fun list(): List<ElementCategoryRow>

    @SqlQuery("select * from element_categories where id = :id")
    fun get(id: String): ElementCategoryRow?

    @SqlUpdate("delete from element_categories where id = :id")
    fun delete(id: String)

}
